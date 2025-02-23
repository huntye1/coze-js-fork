import './App.css';
import { useEffect, useRef } from 'react';

const App = () => {
  const sdkRef = useRef<unknown>(null);
  useEffect(() => {
    //@ts-expect-error -- no type
    sdkRef.current = new CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7460405481438380042',
      },
      componentProps: {
        title: 'Coze',
      },
      auth: {
        type: 'token',
        token:
          'pat_dhblSnsPc4nfK7L2di5Iv7772pL2ickNC3uf929LiIoO9olyx6EtDmSCHIqocRmc',
        onRefreshToken() {
          return 'pat_dhblSnsPc4nfK7L2di5Iv7772pL2ickNC3uf929LiIoO9olyx6EtDmSCHIqocRmc';
        },
      },
      ui: {
        base: {
          icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
          layout: 'mobile',
        },
        asstBtn: {
          isNeed: false,
        },
        footer: {
          isShow: false,
        },
        chatBot: {
          onBeforeHide: () => {
            console.log('onBeforeHide');
            return false;
          },
        },
      },
    });
    sdkRef.current?.showChatBot();
  }, []);

  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <button onClick={() => sdkRef.current?.showChatBot()}>show chat</button>
    </div>
  );
};

export default App;
