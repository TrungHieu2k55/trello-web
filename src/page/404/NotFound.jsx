import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import './styles/404.css'

const NotFound = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          particles: {
            number: {
              value: 2800,
              density: {
                enable: true,
                area: 1000
              }
            },
            color: {
              value: '#ffffff'
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 1,
              random: {
                enable: true,
                minimumValue: 0.6
              },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0,
                sync: false
              }
            },
            size: {
              value: 5,
              random: {
                enable: true,
                minimumValue: 1
              }
            },
            move: {
              enable: true,
              speed: 0.9,
              direction: 'none',
              random: true,
              straight: false,
              outModes: {
                default: 'out'
              }
            }
          },
          detectRetina: true
        }}
      />

      <div className="wrapper">
        <h1>404</h1>
        <h3>We've gone too deep.</h3>

        <Link to="/">
          <button className="link">Home</button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound