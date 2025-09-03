import styles from "./lists.module.css";

export default function MenuList({ activeFilters, onFilterClick }) {
  const menuItems = ["All", "To Do Next Week", "My Timer", "Sessions"];

  return (
    <ol className={styles.MenuList}>
      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => onFilterClick(item)}
          className={
            activeFilters.includes(item)
              ? styles.activeMenuItem
              : styles.inactiveMenuItem
          }
        >
          {item}
        </button>
      ))}
    </ol>
  );
}
