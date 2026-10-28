import { FC } from 'react'
import { Button } from 'react-bootstrap'
import './FoundingDateField.css'

interface Props {
    value: string
    setValue: (value: string) => void
    onSubmit: () => void
    loading?: boolean
    buttonTitle?: string
}

const FoundingDateField: FC<Props> = ({ value, setValue, onSubmit, loading, buttonTitle = 'Найти' }) => (
    <div className="foundingDateField">
        <label className="foundingDateField__caption" htmlFor="founded_before">Основано до</label>
        <input type="date" id="founded_before" value={value} onChange={(event => setValue(event.target.value))}/>
        <Button disabled={loading} onClick={onSubmit}>{buttonTitle}</Button>
    </div>
)

export default FoundingDateField
export { FoundingDateField }
