import Web3 from 'web3'
import networks from '../context/networks'
import { TOKEN_ABI } from '../abi/index'
import { ethers } from 'ethers'

export const getContract = (provider, address, abi = TOKEN_ABI, ) => {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(
    abi,
    address,
  )
  return contract
}

export const formatAddress = (address, start, end) => {
  if (address) {
    return address.slice(0, start) + '...' + address.slice(-end)
  }
}

export const setLocal = (key, value) => {
  const isObj = Object.prototype.toString.call(value) === '[object Object]'
  if(isObj) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}

export const getLocal = (key) => {
  if(localStorage.getItem(key) !== 'undefined') {
    return localStorage.getItem(key)
  }
}

export const delLocal = (key) => {
  localStorage.removeItem(key)
}

export const clearLocal = () => {
  localStorage.clear()
}

export const debounce = function (fn, delay = 1000) {
  return (...rest) => {
    let args = rest
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const throttle = (fn, delay = 3000) => {
  let canRun = true
  return (...rest) => {
    if (!canRun) return;
    canRun = false
    setTimeout(() => {
      fn.apply(this, rest)
      canRun = true
    }, delay)
  }
}
export const isInstalledMetaMask = () => {
  if (typeof window.ethereum === 'undefined') {
    return false
  }
  return true
}

export const getBalance = async (  provider, tokenAddress, userAddress ) => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const handleDecimals = (num, decimalPlaces) => {
  let roundedNum = Math.ceil(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  return roundedNum.toFixed(6)
}

export const getCurrentNetworkInfo = async() => {
  if(!window?.ethereum) return
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const item = networks.filter(i=> i.chainId === network.chainId)[0]
  return item
}
