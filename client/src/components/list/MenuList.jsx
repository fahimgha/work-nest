import styles from "./lists.module.css";

export default function MenuList({ activeFilters, onFilterClick }) {
  const menuItems = [
    "All",
    "No Project Assigned",
    "To Do Next Week",
    "My Promodoro",
  ];

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
