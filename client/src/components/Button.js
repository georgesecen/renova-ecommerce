import "../styles/button.css";
export function Button({ type,onClick,children,isDisabled }) {
    return <button disabled={isDisabled} type={type} onClick={onClick} className="button">{ children}</button>
}