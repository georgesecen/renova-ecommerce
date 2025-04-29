import "../styles/input.css"
export function Input({ type, id, name, placeHolder,value, onChange }) {
    return <input required className="input" type={type} id={id} name={name} placeholder={ placeHolder} onChange={onChange} value={value} />
}