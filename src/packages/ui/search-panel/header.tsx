import {useI18n} from "@/i18n/useI18n";
import {Button} from "devextreme-react";

interface HeaderProps {
  onToggleSettings?: () => void;
  onCollapse?: () => void;
  enableColumnToggler?: boolean
}
export const Header = ({onCollapse, onToggleSettings, enableColumnToggler=true}: HeaderProps) => {
  const {t} = useI18n("Common")
  return (
    <div className={'flex flex-row p-1 items-center'}>
      <div className={'mr-auto flex items-center'}>
        <img src={'/images/icons/search.svg'} alt={'Search'} className={'w-[20px]'} />
        <span className={'ml-2 text-primary'}>{t('Search')}</span>
      </div>
      <div className={'flex-end ml-auto'} >
        {enableColumnToggler && 
        <Button icon={'/images/icons/settings.svg'} id={'toggle-search-settings'} onClick={onToggleSettings}/>
        }
        <Button icon={'/images/icons/collapse-left.svg'} onClick={onCollapse} />
      </div>
    </div>
  )
}
