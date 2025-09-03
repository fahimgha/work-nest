import { Button } from "../buttons/Button";
import styles from "./confirmDialog.module.css";

export default function ConfirmDialog({
  title,
  children,
  onConfirm,
  onCancel,
}) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{children}</p>
        <div className={styles.actions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} color={"#ff6562ff"}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
