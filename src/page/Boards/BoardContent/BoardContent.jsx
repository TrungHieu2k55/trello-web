import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { DndContext, PointerSensor, useSensor, useSensors,
  DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep } from 'lodash'

import { useState, useEffect } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewCard, createNewColumn }) {
  // dùng PointerSensor mặc định thì phải kết hợp thuộc tính touchAction: 'none' ở phần tử kéo thả còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // yêu cầu chuột di chuyển 10px thì mới kich hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // nhấn giữ 250ms và tolerance 500px thì kích hoạt sự kiện kéo thả trên thiết bị cảm ứng
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Ưu tiên sử dụng kết hợp 2 loại dùng mouseSensor và touchSensor để trải nghiệm trên mobile, ít bị bug hơn
  const sensors = useSensors( mouseSensor, touchSensor )


  const [oderedColumns, setOderedColumns] = useState([])

  //cùng một thời điểm chỉ có 1 phần tử được kéo (card hoặc column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm column chứa cardId
  const findColumnByCardId =(cardId) => {
    // nên xài c.cards thay vì c.cardIds bởi vì bước handleDragOver
    // sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardIds mới
    return oderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activecard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán "cardIndex mới" (trên hoặc dưới overCard) lấy chuẩn ra từ code của thư viện
      // - nhiều khi muốn từ chối hiểu
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại
      // OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //nextActiveColumn: column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang
        //column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      //nextOverColumn: column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card khi card qua các column khác nhau
        const rebuild_activeDraggingCardData ={
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log('Drag Started', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì khi kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('Drag Over', event)

    const { active, over } = event

    // cần đảm bảo nếu không tồn tại active hoặc over (khi bị kéo ra khỏi phạm container) thì không làm gì tránh cash trang
    if (!active||!over) return

    //activeDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return


    // xử lý logic ở khi kéo card qua 2 column khác nhau, còn nếu kéo card
    // trong chính column ban đầu của nó thì không làm gì
    // vì đây đang là đoạn xử lý lúc kéo (handleDragover), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề
    //khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('Drag Ended', event)
    const { active, over } = event

    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!active||!over) return

    // Xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      //activeDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả card trong cùng một cái column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)

        // Dùng arraymove vì kéo card trong một column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)


        setOderedColumns(prevColumns => {
          // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại
          // OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)

          //Tìm tới các column mà mình đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)


          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }

    // Xử lý kéo thả columns trong một cái broad content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // Tạo lại thứ tự cột
        const oldColumnIndex = oderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = oderedColumns.findIndex(c => c._id === over.id)

        // arraymove để sắp xếp lại mảng columns ban đầu
        // code arraymove dnt-kit/package/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex)

        // xử lý gọi  api
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds )
        setOderedColumns(dndOrderedColumns)
      }
    }


    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          // phần tử khi thả sẽ làm mờ
          opacity: '0.5'
        }
      }
    })
  }

  const { mode, systemMode } = useColorScheme()
  // Nếu mode = system thì lấy systemMode, ngược lại lấy mode
  const resolvedMode = mode === 'system' ? systemMode : mode
  return (
    <DndContext
      sensors={sensors}
      // thuật toán va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua column được vì lúc này
      //nó bị conflict giữa card và column), nên xài closestCorners trên thư viện dnd-kit
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: resolvedMode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={ oderedColumns }
          createNewColumn={createNewColumn}
          createNewCard={createNewCard} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
