"use client";
import { Box } from '@biom3/react';
import { checkout } from '@imtbl/sdk';
import { ConnectionSuccess, Widget, WidgetType } from '@imtbl/sdk/checkout';
import { Environment } from '@imtbl/sdk/config';
import { useEffect, useState } from 'react';
import { usePassport } from '../../context/passport';

function Widgets() {
  const [widget, setWidget] = useState<Widget<WidgetType.IMMUTABLE_COMMERCE>>();
  const { passportInstance } = usePassport();
  

  useEffect(() => {
    const loadWidgets = async () => {
      if(!passportInstance) return;

      const baseConfig = {
        environment: Environment.SANDBOX,
      };

      const checkoutSDK = new checkout.Checkout({
        baseConfig,
        bridge: { enable: true },
        onRamp: { enable: true },
        swap: { enable: true },
        passport: passportInstance
      });

      const widgetsFactory = await checkoutSDK.widgets({ config: {} });
      const widget = widgetsFactory.create(WidgetType.IMMUTABLE_COMMERCE, {})
      setWidget(widget);
    }

    loadWidgets();
  }, [passportInstance]);


  useEffect(() => {
    if (!widget) return;

    const items = [
      {
        productId: 'P1',
        qty: 1,
        name: 'Test collection',
        image: 'https://i.seadn.io/s/raw/files/5c454d2e9f57a46166b68b682c4e33ab.gif',
        description: 'Test collection',
      }
    ];

    widget.mount('widget-root', {
      flow: checkout.CommerceFlowType.SALE,
      language: 'en',
      items: items,
      environmentId: process.env.NEXT_PUBLIC_ENV_ID,
      collectionName: 'Test collection',
    });

    widget.addListener(
      checkout.CommerceEventType.SUCCESS,
      (payload: checkout.CommerceSuccessEvent) => {
        const { type, data } = payload;

        // capture provider after user connects their wallet
        if (type === checkout.CommerceSuccessEventType.CONNECT_SUCCESS) {
          const { walletProviderName } = data as ConnectionSuccess;
          console.log('connected to ', walletProviderName);
          // setProvider(data.provider);

          // optional, immediately close the widget
          // widget.unmount();
        }
      }
    );

    // detect when user fails to connect
    widget.addListener(
      checkout.CommerceEventType.FAILURE,
      (payload: checkout.CommerceFailureEvent) => {
        const { type, data } = payload;

        if (type === checkout.CommerceFailureEventType.CONNECT_FAILED) {
          console.log('failed to connect', data.reason);
        }
      }
    );

    // remove widget from view when closed
    widget.addListener(checkout.CommerceEventType.CLOSE, () => {
      widget.unmount();
    });

    // clean up event listeners
    return () => {
      widget.removeListener(checkout.CommerceEventType.SUCCESS);
      widget.removeListener(checkout.CommerceEventType.DISCONNECTED);
      widget.removeListener(checkout.CommerceEventType.CLOSE);
    };


  }, [widget]);

  return (
    <div>
      <Box
        id="widget-root"
        sx={{
          minw: "430px",
          minh: "650px",
          bg: "base.color.translucent.standard.300",
          brad: "base.borderRadius.x5",
        }}
      />
    </div>
  )
}

export default Widgets;
