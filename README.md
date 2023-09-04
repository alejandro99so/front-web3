## Versión en Español
## Integración Frontend con NextJs desde cero

En este repositorio aprenderemos a crear un proyecto frotend, a conectarlo con una wallet y con un contrato inteligente desde cero, solo necesitamos tener instalado una terminal como ```git bash```, ```Linux```, o ```Mac```. Debemos tener instalado nodejs, en mi caso utilizo la versión 16.20.1, el resto de accesos los conseguiremos en internet.

### Creación de proyecto frontend usando NextJS

Lo primero que vamos a hacer es ir a la documentación oficial de NextJS (https://nextjs.org/docs/getting-started/installation). Allí nos dirigimos al apartado de instalación automática (Automatic Installation) y copiamos lo que nos dice que debemos usar en la terminal: ```npx create-next-app@latest```, aquí empezaremos con una configuración de frontend, en mi caso usaré la convención que me permite crear rutas solo con crear carpetas, y se puede usar ```@/styles/Home.module.css``` para referenciar los estilos sin tener que usar ```../``` y buscar la ruta de ```styles``` adicionalmente usare ```css``` y ```TypeScript``` a lo vieja escuela con estilo, si quieren usar tailwind u otra configuración, esto se decide al momento de correr ```npx create-next-app@latest```, a continuación, mi configuración:

- What is your project named? ```front-web-3```
- Would you like to use TypeScript? No / ```Yes```
- Would you like to use ESLint? No / ```Yes```
- Would you like to use Tailwind CSS? ```No``` / Yes
- Would you like to use `src/` directory? No / ```Yes```
- Would you like to use App Router? (recommended) ```No``` / Yes
- Would you like to customize the default import alias? No / ```Yes```
- What import alias would you like configured? ```@/*```

Despues de crear nuestro proyecto recordemos tener nuestra terminal en la ruta del proyecto por lo que usamos ```cd front-web-3```, si queremos correr el demo del proyecto usamos ```npm run dev```.

Creamos un archivo llamado ```.env```, el cual será el responsable de guardar nuestras variables de ambiente, los que no conocen este tipo de practica en programación, se usa para tener variables que no pueden ser vistas dentro del código ya que son sensibles por el hecho de que cobran por su uso y no queremos que un usuario mal intencionado o ingenuo utilice de manera irresponsable dicho acceso, usualmente también se utiliza cuando dicha variable cambia según el ambiente que se está trabajando como uno de desarrollo, uno de producción, etc.

Para usar variables de entorno en nextJs debemos llamarla con un prefijo de ```NEXT_PUBLIC_```, a continuación, un ejemplo de un archivo ```.env```.

<pre>
<code>
NEXT_PUBLIC_SALUDO = hola
NEXT_PUBLIC_PROJECT_ID = 1234567890abcdefg
</code>
</pre>

### Instalación de librería que deje conectar la wallet

Para este caso usaremos WalletConnect, empezando por:

### Obtención de projectId

Si queremos conectar un proyecto con una wallet compatible con EVM, una de las formas de hacerlo es usando un proveedor de coneción con wallets, hay varios como walletconnect, rainbowkit, etc., y la mayoría usan en el fondo walletconnect, por lo que usaremos esta por defecto las demás funcionan muy similar y si usan la misma base requerirán un projectId, para lo cual los pasos para obtener dicho projectId son: 

- Iremos al dashboard de walletconnect (https://cloud.walletconnect.com/app).
- Iniciaremos sesión, en mi caso lo hice conectando mi wallet como mecanismo de autenticación.
- Crearemos un nuevo proyecto con el nombre que requiramos, en mi caso use ```front-web-3```.
- Al abrir el proyecto en información veremos un campo llamado Project ID, cuyo valor es el projectId que necesitamos usar.
- Copiaremos ese Project ID a una variable de entorno en nuestro frontend en el archivo ```.env``` y lo llamaremos ```NEXT_PUBLIC_PROJECT_ID```.

### Instalación y configuración de librerías web3 en frontend

A partir de este momento comenzará lo bueno!! Empezaremos a instalar y configurar las librerías que requiere el proyecto front para poder leer wallets compatibles con EVM y poder interactuar con funciones dentro de un contrato inteligente, para esto seguiremos la guía de la documentación de walletconnect (https://docs.walletconnect.com/2.0/web3modal/react/wagmi/installation).

1. Instalar librerías. Para instalar las librerías necesarias, correremos el siguiente comando en la terminal (recordemos que debemos estar en la ruta de nuestro proyecto), ```npm install @web3modal/ethereum @web3modal/react wagmi viem```.
2. Abrir el archivo ```_app.tsx```, o el componente principal que envuelve todo el frontend, puede tener un código como este

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

3. Luego de estar aquí pegamos la configuración que nos sale en la parte de implementación (Implementation) en la documentación, pero usemos la siguiente del ejemplo.

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// -----------------Desde acá-----------------
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { avalancheFuji, sepolia, polygonMumbai } from 'wagmi/chains'

const chains = [avalancheFuji, sepolia, polygonMumbai]
const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID)

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
// -----------------Hasta acá-----------------

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

- Nota: En este ejemplo hicimos unas modificaciones para poder tener un frontend compatible con contratos de prueba, podemos probar contratos inteligentes desplegados en la red de prueba de Avalanche (Fuji), Ethereum (Sepolia) y Polygon (Mumbai), en la linea ```import { avalancheFuji, sepolia, polygonMumbai } from 'wagmi/chains'``` se debe especificar dentro del import que cadenas se van a utilizar en nuestro proyecto frontend, posteriormente se deben enlistar en la variable ```chains``` así ```const chains = [avalancheFuji, sepolia, polygonMumbai]```.

1. Lo siguiente que haremos será encapsular nuestro componente padre principal ```<Component {...pageProps} />``` en las etiquetas de la librería para poder usar todos los jueguetes que esta nos ofrece!!🔥🔥

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { avalancheFuji, sepolia, polygonMumbai } from 'wagmi/chains'

const chains = [avalancheFuji, sepolia, polygonMumbai]
const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID)

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

// -----------------Desde acá-----------------
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
// -----------------Hasta acá-----------------
```

5. Una vez configuradas las cadenas que necesitamos en nuestro proyecto procedemos a configurar el botón de wallet connect en la página que necesitamos usar, ejemplo de esto puede ser nuestro header, en caso de tenerlo, acá debido a que es una prueba voy a colocarlo en el archivo ```index.tsx``` que está en ```pages/```, dicho archivo se ve así:

```tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

// importación de botón de wallet connect
import { Web3Button } from "@web3modal/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Mi proyecto de frontend web3</h1>
        {/* Uso de botón de wallet connect */}
        <Web3Button />
      </main>
    </>
  );
}
```

Nota: En este punto ya debemos tener un botón para interactuar con nuestra wallet en nuestro proyecto frontend, y este botón se debe poder conectar con la blockchain que necesitamos usar en nuestro proyecto.

### Interacción de frontend con contrato inteligente

Una vez tenemos acceso a una wallet podemos interactuar con contratos inteligentes, ya que estas administran la llave privada de los usuarios y pueden firmar las transacciones que queramos hacer, por lo que en este punto ya podemos pensar en interactuar con contratos inteligentes para obtener información de variables de estado, modificar dichas variables, así como enviar y recibir criptoactivos desde una interfáz gráfica que depende de la imaginación de un diseñador puede llegar a ser lo más amigable con el usuario posible.

Lo primero que haremos es guardar en el frontend la información que requiere cualquiera para poder interactuar con un contrato inteligente, es decir el ABI y la dirección del contrato, para eso crearemos un archivo llamado ```contract.json``` en ```src/utils/contract.json```.

Un ejemplo del contenido de este archivo es:

```json
{
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "newName",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        }
      ],
      "name": "setName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "address": "0x28Ff5167337966E31fa5425d5b6efd45F4F20c8D"
}
```

Nota: Para poder acceder al ABI o a la dirección del contrato es necesario referenciarlo y solo acceder a ```.address``` o ```.abi``` así:

<pre>
<code>
// importación del archivo con la información del contrato
import contractInformation from "@/utils/contract.json";
// Para acceder a la dirección del contrato
contractInformation.address
// Para acceder al ABI del contrato
contractInformation.abi
</code>
</pre>

Ahora debemos hacer uso de una de las librerías que instalamos con walletconnect ```wagmi```, la cual nos permitirá interactuar con nuestro contrato inteligente, empecemos a ver algunas librerías de (https://wagmi.sh/).

#### useContractRead

Para no abrumarnos con tanta información en la documentación de wagmi, vayamos al grano, si queremos leer variables dentro de un contrato inteligente vamos a: "https://wagmi.sh/react/hooks/useContractRead".

En este apartado nos explican como usar la librería de lectura de una manera básica y sencilla.

En el archivo ```src/pages/index.tsx``` haremos el ejemplo de leer la función ```getName()``` de nuestro contrato y se ve así:

```tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Web3Button } from "@web3modal/react";
// importación del archivo con la información del contrato
import contractInformation from "@/utils/contract.json";
import { useContractRead } from "wagmi";
import { useState } from "react";
import { sepolia } from "wagmi/chains";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [nameContract, setNameContract] = useState("");
  // conexión con contrato
  const contractRead = useContractRead({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "getName",
    chainId: sepolia.id,
    onSuccess(data: string) {
      // asignación de variable de contrato a hook en react
      setNameContract(data);
    },
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>
          Mi proyecto de frontend
          {nameContract == "" ? " web3" : ` web3, saludos de ${nameContract}`}
        </h1>
        <Web3Button />
      </main>
    </>
  );
}
```

Nota: Se debe importar la blockchain que queremos usar para poder pasarle a la función de read el chainId, esto debido a que estamos usando más de una blockchain en nuestro frontend, y debemos especificarle en que cadena debe buscar el contrato y para eso necesita el id de la cadena.

#### useContractWrite

Ya tenemos variables de un contrato inteligente! Ahora permitiremos que cualquiera que conecte su wallet pueda modificar las variables de ese contrato, los cambios los haremos en el mismo archivo y se ve así.

```tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Web3Button } from "@web3modal/react";
// importación del archivo con la información del contrato
import contractInformation from "@/utils/contract.json";
import {
  useContractRead,
  useContractWrite,
  useAccount,
} from "wagmi";
import { useState, useEffect, FormEvent } from "react";
import { sepolia } from "wagmi/chains";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [nameContract, setNameContract] = useState("");
  const [addressConnected, setAddressConnected] = useState<
    null | `0x${string}`
  >();
  const { address } = useAccount();
  // conexión de lectura con contrato
  const contractRead = useContractRead({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "getName",
    chainId: sepolia.id,
    onSuccess(data: string) {
      // asignación de variable de contrato a hook en react
      setNameContract(data);
    },
  });

  // conexión de escritura con contrato
  const contractWrite = useContractWrite({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "setName",
    chainId: sepolia.id,
    onSuccess(data) {
      console.log(data);
    },
  });

  const updateName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = (e.target as HTMLFormElement).elements["name"];
    if (element.value)
      contractWrite.write({
        args: [element.value],
      });
    element.value = "";
  };

  useEffect(() => {
    setAddressConnected(address);
  }, [address]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>
          Mi proyecto de frontend
          {nameContract == "" ? " web3" : ` web3, saludos de ${nameContract}`}
        </h1>
        <Web3Button />
        <form onSubmit={updateName}>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />
          <button disabled={!addressConnected} type="submit">
            Actualizar
          </button>
        </form>
      </main>
    </>
  );
}
```

Nota: Se observan nuevas cosas empecemos con ```useAccount```, este hook nos permite conocer la dirección del usuario que está conectado, para interactuar con un contrato inteligente se requiere de una wallet que firme la transacción por lo tanto el botón de actualizar está deshabilitado si no se detecta nadie conectado, al llamar el ```contractWrite.write()``` se le envian los parametros necesarios para su ejecución, en este caso lo son los ```args```, es decir los argumentos que requiere la función ```setName``` para actualizar la variable de estado.

#### useContractEvent

Como se conforma más facil un fan de marvel con una pelicula al año que yo, les traigo un plus!! Qué pasa si actualicé la variable de estado y quiero que vuelva a llamar al contrato para revisar y actualizar el valor de la variable cuando este cambie, adicional que se vea reflejado de manera automatica en mi frontend, solo con escuchar un evento, para esto usamos el poderoso comando de ```useContractEvent``` así:

```tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Web3Button } from "@web3modal/react";
// importación del archivo con la información del contrato
import contractInformation from "@/utils/contract.json";
import {
  useContractRead,
  useContractWrite,
  useContractEvent,
  useAccount,
} from "wagmi";
import { useState, useEffect, FormEvent } from "react";
import { sepolia } from "wagmi/chains";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [nameContract, setNameContract] = useState("");
  const [addressConnected, setAddressConnected] = useState<
    null | `0x${string}`
  >();
  const { address } = useAccount();
  // conexión de lectura con contrato
  const contractRead = useContractRead({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "getName",
    chainId: sepolia.id,
    onSuccess(data: string) {
      // asignación de variable de contrato a hook en react
      setNameContract(data);
    },
  });

  // conexión de escritura con contrato
  const contractWrite = useContractWrite({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "setName",
    chainId: sepolia.id,
    onSuccess(data) {
      console.log(data);
    },
  });

  // conexión de lectura de evento
  useContractEvent({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    eventName: "newName",
    chainId: sepolia.id,
    listener(log) {
      console.log(log);
      contractRead.refetch();
    },
  });

  const updateName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = (e.target as HTMLFormElement).elements["name"];
    if (element.value)
      contractWrite.write({
        args: [element.value],
      });
    element.value = "";
  };

  useEffect(() => {
    setAddressConnected(address);
  }, [address]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>
          Mi proyecto de frontend
          {nameContract == "" ? " web3" : ` web3, saludos de ${nameContract}`}
        </h1>
        <Web3Button />
        <form onSubmit={updateName}>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />
          <button disabled={!addressConnected} type="submit">
            Actualizar
          </button>
        </form>
      </main>
    </>
  );
}
```

### Conexión con proveedores externo

Para poder interactuar con el mundo de la blockchain necesitamos conectarnos con unos proveedores que nos permitan agregar nuestra transacción a la mempool para que puedan ser tomadas por los nodos validadores y la procesen, por defecto las librerías mencionadas anteriormente nos ofrecen un proveedor de prueba con capacidad limitada, pero si queremos salir a producción no podemos usar estos servicios, para eso debemos configurar nuestros propios proveedores, uno de los más famosos es alchemy, a continuación veremos cómo conectarnos a este para poder darle escalabilidad a nuestra DApp.

1. Vayamos a la página de Alchemy y creemosno una cuenta en ```https://dashboard.alchemy.com```.
2. Una vez estemos en el dashboard de Alchemy, vamos al apartado de Apps.
3. Ya en apps, demosle clic al botón de crear nueva app (Create new app), allí seleccionamos la blockchain que necesitemos y adicional la red que necesitamos, la de prueba o producción; le damos un nombre y una descripción y la creamos!
4. Una vez creada le damos en ```view key``` para ver la ```API Key```, le damos en ```Copy```, vamos al archivo ```.env``` y guardamos este valor como ```NEXT_PUBLIC_ALCHEMY_PROVIDER```.
5. Volvemos a ```src/pages/_app.tsx``` agregamos esta linea en los import ```import { alchemyProvider } from '@wagmi/core/providers/alchemy'``` y actualizamos un poco la instancia de las cadenas, el código queda así:

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { avalancheFuji, sepolia, polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID)
const alchemyApiKey = String(process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER)

const { chains, publicClient } = configureChains(
  [avalancheFuji, sepolia, polygonMumbai], 
  [
    // se agrega un nuevo proveedor, en este caso de alchemy
    // de paso se quita un error que teniamos por usar el provider
    // publico de walletconnect (;
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
```

### Agreguemos nuestro propio RPC

Allá afuera hay multiples blockchains, podemos tener una local incluso usando hardhat o truffle, también podemos crear nuestras propias blockchain haciendo uso de subnets en Avalanche, en todos estos casos tenemos un nuevo RPC (llamada a procedimiento remoto) para estas nuevas blockchain, es información personalizada que acabamos de crear y por lo tanto la librería no lo tiene, en ese caso ¿cómo permitimos que nuestro frontend se pueda conectar a esas blockchain? veamoslo a continuación!

En el archivo ```.env``` agreguemos una nueva variable de entorno que se llame ```NEXT_PUBLIC_CUSTOM_RPC``` el cual tendra nuestro RPC.

Vamos a volver a modificar ese archivo de ```src/pages/_app.tsx``` pero valdrá la pena! porque no tenemos que estar rogando por faucet, ya que en todos los casos podemos tener los tokens que queramos sea con una subnet de Avax o con un proyecto local con una de las wallets precargadas, ese archivo queda así:

```tsx
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
    jsonRpcProvider({
      rpc: () => ({
        http: customRpc,
      }),
    }),
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
```

Además de esto debemos hacer unas cuantas configuraciones adicionales al momento de llamar al contrato, debemos cambiar el chainId, y la wallet que llama al contrato para hacer el get, el archivo ```index.tsx``` se ve así:

```tsx
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Web3Button } from "@web3modal/react";
// importación del archivo con la información del contrato
import contractInformation from "@/utils/contract.json";
import {
  useContractRead,
  useContractWrite,
  useContractEvent,
  useAccount,
} from "wagmi";
import { useState, useEffect, FormEvent } from "react";
import { sepolia } from "wagmi/chains";

const inter = Inter({ subsets: ["latin"] });
const customChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

export default function Home() {
  const [nameContract, setNameContract] = useState("");
  const [addressConnected, setAddressConnected] = useState<
    null | `0x${string}`
  >();
  const { address } = useAccount();
  // conexión de lectura con contrato
  const contractRead = useContractRead({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "getName",
    chainId: customChainId,
    account: address,
    onSuccess(data: string) {
      // asignación de variable de contrato a hook en react
      setNameContract(data);
    },
  });

  // conexión de escritura con contrato
  const contractWrite = useContractWrite({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    functionName: "setName",
    chainId: customChainId,
    onSuccess(data) {
      console.log(data);
    },
  });

  // conexión de lectura de evento
  useContractEvent({
    address: contractInformation.address as `0x${string}`,
    abi: contractInformation.abi,
    eventName: "newName",
    chainId: sepolia.id,
    listener(log) {
      console.log(log);
      contractRead.refetch();
    },
  });

  const updateName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = (e.target as HTMLFormElement).elements["name"];
    if (element.value)
      contractWrite.write({
        args: [element.value],
      });
    element.value = "";
  };

  useEffect(() => {
    setAddressConnected(address);
  }, [address]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>
          Mi proyecto de frontend
          {nameContract == "" ? " web3" : ` web3, saludos de ${nameContract}`}
        </h1>
        <Web3Button />
        <form onSubmit={updateName}>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />
          <button disabled={!addressConnected} type="submit">
            Actualizar
          </button>
        </form>
      </main>
    </>
  );
}
```

Para que esto funcione debemos tener importada la blockchain en nuestra wallet con el respectivo RPC y chainId.

## English version

## Frontend integration from scratch

In this repository, we will learn how to create a frontend project, connect it to a wallet, and interact with a smart contract from scratch. All we need is to have a terminal installed, such as ```git bash```, ```Linux```, or ```Mac```. We should also have Node.js installed, in my case, I'm using version 16.20.1, and we can obtain the rest of the required dependencies from the internet.