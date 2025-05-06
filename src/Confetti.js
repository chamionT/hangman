import { useWindowSize } from 'react-use'

export default () => {
    const { width, height } = useWindowSize()
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
        <Confetti width={width} height={height} recycle={false} numberOfPieces={1000} />
      </div>
    )
  }