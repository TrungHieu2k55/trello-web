import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

import { DndContext, PointerSensor, useSensor, useSensors,
  MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
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

  useEffect(() => {
    setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    // console.log('Drag Started', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    // console.log('Drag Ended', event)
    const { active, over } = event


    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    if (active.id !== over.id) {
      // Tạo lại thứ tự cột
      const oldIndex = oderedColumns.findIndex(c => c._id === active.id)
      const newIndex = oderedColumns.findIndex(c => c._id === over.id)

      // arraymove để sắp xếp lại mảng columns ban đầu
      // code arraymove dnt-kit/package/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(oderedColumns, oldIndex, newIndex)

      // xử lý gọi  api
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds )
      setOderedColumns(dndOrderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
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
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} >
      <Box sx={{
        bgcolor: resolvedMode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={ oderedColumns } />
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
