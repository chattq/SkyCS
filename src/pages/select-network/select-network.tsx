import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ccsApi} from "src/packages/api";
import {logger} from "@packages/logger";
import {useAuth} from "@packages/contexts/auth";

export const SelectNetworkPage = () => {
  const NetworkID: string = `${import.meta.env.VITE_NETWORK_FIX}`;
  const navigate = useNavigate();
  const {selectNetwork} = useAuth()
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    (async function() {
      try {
        console.log('start to list networks')
        const resp = await ccsApi.getNetworks();
        if (resp.Success) {
          const data = resp.Data
          console.log('list networks:', resp)
          if(data.length === 1) {
            console.log('navigate to default network:', data[0].Id)
            selectNetwork(data[0].Id)
            navigate(`/${data[0].Id}`);
          } else if (data.length > 1 && NetworkID) {
            selectNetwork(NetworkID)
            navigate(`/${NetworkID}`);
          }
          setList(data);
        } else {
          console.log('error:', resp)
          logger.debug('error:', resp)
        }
      } catch(e) {
        console.log('error:', e)
        logger.debug('error:', e)
      }
    })()
  }, []);
  return (
    <>
      <section className="content">
        <div className="sidebar-page">
          <section className="content">
            {list.map((i: any) => (
              <h6 key={i.Id} className="p-2">
                <Link to={`/${i.Id}`}>{i.Name}</Link>
              </h6>
            ))}
          </section>
        </div>
      </section>
    </>
  );
};
