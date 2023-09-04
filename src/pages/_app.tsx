import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { avalancheFuji, sepolia, polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID)
const alchemyApiKey = String(process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER)
const customRpc = String(process.env.NEXT_PUBLIC_CUSTOM_RPC)

const { chains, publicClient } = configureChains(
  [avalancheFuji, sepolia, polygonMumbai], 
  [
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: customRpc,
    //   }),
    // }),
    alchemyProvider({ apiKey: alchemyApiKey }),
    w3mProvider({ projectId })
  ]
  )
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
