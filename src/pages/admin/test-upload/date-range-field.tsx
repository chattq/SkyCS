import dxForm from "devextreme/ui/form";
import {ForwardedRef, forwardRef, useRef, useState} from "react";
import {DateBox} from "devextreme-react";
import {isAfter, isBefore} from "date-fns";

interface DateRangeFieldProps {
  formInstance: dxForm;
  onValueChanged: (files: any) => void;
  dataField?: string;
  className?: string;
}

export const DateRangeField = forwardRef(({formInstance, dataField, onValueChanged, className}: DateRangeFieldProps, ref: ForwardedRef<any>) => {
  const fromRef = useRef<DateBox>(null)
  const toRef = useRef<DateBox>(null)
  const handleValueFromChanged = (e: any) => {
    const {value} = e;
    const toValue = toRef.current?.instance.option("value") as Date;
    if(toValue && isAfter(value, toValue)) {
      e.cancel = true
      setError("DateFromIsInvalid")
    } else {
      setError("")
      const val = {from: value, to: toValue}
      onValueChanged(val)
    }
  }
  const [error, setError] = useState("")
  const handleValueToChanged = (e: any) => {
    const {value} = e;
    const fromValue = fromRef.current?.instance.option("value") as Date
    if(fromValue && isBefore(value, fromValue)) {
      e.cancel = true;
      setError("DateToIsInvalid")
    } else {
      setError("")
      const val = {from: fromValue, to: value}
      onValueChanged(val)
    }
  }
  return (
    <div className={className}>
    <div className={'flex items-center'}>
      <div className={""}>
        <DateBox width={120} 
                 ref={fromRef}
                 isValid={!error}
                 openOnFieldClick={true} 
                 onValueChanged={handleValueFromChanged}
        />
      </div>
      <div className={'mx-1'}>-</div>
      <div className={""}>
        <DateBox 
          ref={toRef}
          width={120}
          isValid={!error}
          openOnFieldClick={true}
          onValueChanged={handleValueToChanged}
        />
      </div>
    </div>
      {!!error && (
        <div className={"mt-1"}>
          <span className={"text-red-600 text-xs"}>
          {error}
          </span>
        </div>
      )}
    </div>
  )
})