import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { useHub } from "@/packages/hooks/useHub";
import { CcCallingInfo } from "@/packages/types";
import { ContextMenu, Popup } from "devextreme-react";
import Button from "devextreme-react/button";
import { Position } from "devextreme-react/popup";
import { useEffect, useMemo, useState } from "react";
import "./phone.scss";
import { PhonePopup } from "./popup";
import { CallFowardPopup } from "./call-forward-popup";
import { nanoid } from "nanoid";
import { id } from "date-fns/locale";
declare global {
  interface Window {
    Phone: any;
  }
}

export interface CallState {
  state?: string; //none, ringing, incall, ended
  direction?: string; //incoming, outgoing, ring
  remoteNumber?: string;
  fromNumber?: string;
  toNumber?: string;
}
export function CallButtton() {
  const hub = useHub("global");

  const myId = useMemo(() => {
    return "toggle-phone";
  }, []);

  const [isPopupVisible, setPopupVisibility] = useState(false);
  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  const [isOnline, setOnlineStatus] = useState(false);

  const { auth } = useAuth();

  const [callingInfo, setCallingInfo] = useState<CcCallingInfo>({});
  const [callState, setCallState] = useState<CallState>({});

  const myClientId = useMemo(() => {
    return nanoid();
  }, []);

  const phone = window.Phone || {};
  useEffect(() => {
    hub.start(()=>{

      
      hub.onReceiveMessage("NewClientLogin", (cid)=>{

        if(cid!=myClientId)
        {
            
              window.location.href ='/disconnected';
            

        }
      });
    });
    

    callApi.getMyCallingInfo(auth.networkId, { clientId: myClientId }).then((resp) => {
      if (resp.Success && resp.Data) {
        var ci = resp.Data;

        ci.Password = auth.token;

        callApi.getOrgInfo(auth.networkId).then((resp) => {
          if (resp.Success && resp.Data) {
            ci.OrgInfo = resp.Data;

            setCallingInfo(ci);

            phone.init(ci);

            phone.onRegistered(function () {
              setOnlineStatus(true);
            });
            phone.onUnregistered(function () {
              setOnlineStatus(false);
            });

            phone.onStateChanged(function (state: CallState) {
              // alert(`incoming call from ${session.remote_identity.uri.user}`)

              //alert(state)

              setCallState(state);

              setPopupVisibility(true);

              //phone.answer();
              //session.terminate();
            });


            window.setTimeout(function () {
              phone.connect();
              //alert('connected')
            }, 100);
          }
        });
      }
    });



    return () => {
      phone.disconnect();
    };
  }, []);

  const menuItems = useMemo(() => ([
    {
      text: 'Online',
      //icon: 'user',
      onClick: () => {
        phone.connect();
      }
    },
    {
      text: 'Offline',
      //icon: 'user',

      onClick: () => {

        phone.disconnect();

      }
    },

  ]), []);

  if (callingInfo && callingInfo.ExtId)
    return (
      <>
        <div className="flex">
          <span className="phone-online-status mr-5">
            {isOnline && <>
              <i className="dx-icon-isnotblank mr-1" style={{ color: 'green' }} />Online
            </>}
            {!isOnline && <>
              <i className="dx-icon-isnotblank mr-1" style={{ color: 'gray' }} />Offline
            </>}
            <i className="dx-icon-chevrondown ml-1" />
          </span>

          <ContextMenu
            items={menuItems}
            target={`.phone-online-status`}

            showEvent={'dxclick'}
            cssClass={''}
            width={100}
          >
            <Position
              at={`right top`}
              my={`right top`}
              //of={`#${myId}`}
              offset={{ x: 0, y: 40 }}
            />
          </ContextMenu>

          {isOnline && (
            <Button className={"call-button"}>
              <div>
                <img src="/images/icons/call.png" onClick={togglePopup} id={myId} />
                <Popup
                  visible={isPopupVisible}
                  hideOnOutsideClick={
                    !callState.state || callState.state == "ended"
                  }
                  onHiding={togglePopup}
                  width={350}
                  height={"auto"}
                  showTitle={false}
                  wrapperAttr={{ class: "phone-popup" }}
                >
                  <Position
                    at={`right top`}
                    my={`right top`}
                    of={`#${myId}`}
                    offset={{ x: 0, y: 40 }}
                  />
                  <PhonePopup callingInfo={callingInfo} callState={callState} />
                </Popup>
              </div>
            </Button>
          )}

        </div>
        <CallFowardPopup />

      </>
    );
  else return <></>
}
