function Checkbox({ checked, onChangeCheck, hideCheckbox }) {
  if (hideCheckbox) {
    return null;
  }

  const onChange = (e) => {
    const check = e.target.checked;
    onChangeCheck(check);
  };
  return (
    <label className="checkbox">
      <input
        className="checkbox_input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <svg className="checkbox_check" width="15" height="15">
        <polyline points="11 5 6 10 4 8"></polyline>
      </svg>
    </label>
  );
}
export default Checkbox;
