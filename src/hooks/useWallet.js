import { token } from "../constant/token"
import { ethers } from "ethers"
import { getLocal, setLocal, getCurrentNetworkInfo } from "../utils"
import { useState, useEffect } from "react"
import MetaMaskOnboarding from '@metamask/onboarding'
import useGlobal from './useGlobal'
const networkList = {
  513100: 'ETHF'
}
export default function useWallet() {
  const { networks, setState, updateAccounts } = useGlobal()
  const [chainId, setChainId] = useState()
  const [balance, setBalance] = useState()
  const [network, setNetwork] = useState()

  const disConnect = async () => {
    if (window.ethereum.on) {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
      localStorage.removeItem('account')
      setState({
        accounts: null
      })
      setLocal('isConnect', 0)
    }
  }

  const changeNetwork = async (network) => {
    setState({
      showConnectNetwork: false
    })
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log(account, 'account')
    handleNewAccounts(account)
    const { name, decimals, symbol, chainId, rpcUrls, chainName, blockExplorerUrls } = token[network]
    const nativeCurrency = { name, decimals, symbol }
    let params = [{
      chainId,
      rpcUrls,
      chainName,
      nativeCurrency,
      blockExplorerUrls
    }]

    await window.ethereum?.request({ method: 'wallet_addEthereumChain', params })
    getAccounInfo(account)
  }
  const handleNewAccounts = newAccounts => {
    getNetworkInfo()
    getCurrentBalance(newAccounts[0])
    updateAccounts(newAccounts[0])
    setLocal('account', newAccounts[0])
    setLocal('isConnect', 1)
  }

  const getAccounInfo = async(account) => {
    if(!getLocal('isConnect')) return
    getCurrentBalance(account[0])
    setLocal('isConnect', 1)
  }

  const getCurrentBalance = async(account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(account)
    const etherString = ethers.utils.formatEther(balance)
    setBalance(etherString)
    setState({
      currentTokenBalance: etherString
    })
    return etherString
  }
  const getNetworkInfo = async() => {
    try {
      const item = await getCurrentNetworkInfo()
      setChainId(item.chainId)
      setState({
        chainId: item.chainId
      })
      if(!item) return
      const currNetwork = networkList[item.chainId]
      setLocal('network', currNetwork)
      
      setNetwork(currNetwork)
      setState({
        currentChain: currNetwork,
        currentNetworkInfo: item,
      })
    } catch(error) {
      console.log(error, 'getNetworkInfo====')
    }
  }
  const setNetworkInfo = (chainId) => {
    const item = networks.filter(i=> i.chainId === parseInt(chainId, 16))[0]
    if(!item) {
      setChainId()
      return
    }
    setState({
      currentNetworkInfo:item
    })
    setLocal('network', item?.name)
    setNetwork(item?.name)
    setChainId(item?.chainId)
  }
  const handleChainChanged = async(chainId) => {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setNetworkInfo(chainId)
    getCurrentBalance(account[0])
  }
  const initWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const account = await window?.ethereum?.request({ method: 'eth_requestAccounts' })
      handleNewAccounts(account)
      getAccounInfo(account)
      window.ethereum.on('chainChanged', chainId => {
        setState({
          chainId: parseInt(chainId, 16)
        })
        handleChainChanged(chainId)
      })
      window.ethereum.on('accountsChanged', (account) => {
        console.log('accountsChanged====>>>')
        updateAccounts(account[0])
        setLocal('account', account[0])
        getAccounInfo(account)
      })
      window.ethereum.on('connect', id => {
        // console.log('connect',id)
      })
      window.ethereum.on('disconnect', () => {
        // console.log('wallet disconnect')
      })
      window.ethereum.on('message', message => {
        // console.log('wallet message', message)
      })
      window.ethereum.on('notification', message => {
        // console.log('wallet notification', message)
      })
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts)
      }
    }
  }
  useEffect(() => {
    initWallet()
  }, [getLocal('account')])
  return { disConnect, chainId, balance ,network, changeNetwork, getCurrentBalance }
}
