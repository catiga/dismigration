import Button from '../../component/Button'
import useGlobal from '../../hooks/useGlobal'
export default function ConnectButton(props) {
  const { setState } = useGlobal()
  const connectWallet = () => {
    setState({
      showConnectNetwork: true
    })
  }
  return (
    <>
      <Button label="Connect wallet" onClick={() => connectWallet()} size="small" style="primary" />
    </>
  )
}