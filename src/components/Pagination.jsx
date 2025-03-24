import {
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { subDays } from "date-fns";
export default function Pagination({ currentStartDate, setCurrentStartDate }) {
  const today = new Date();

  const updateDates = (startDate) => {
    setCurrentStartDate(startDate);
  };

  const goToPreviousPage = (intervalDays) => {
    updateDates(subDays(currentStartDate, intervalDays));
  };
  const goToNextPage = (intervalDays) => {
    updateDates(subDays(currentStartDate, -intervalDays));
  };
  const goToday = () => {
    updateDates(today);
  };

  return (
    <div className="paginations">
      <div className="pagination-previous">
        <div onClick={() => goToPreviousPage(7)}>
          <HiChevronDoubleLeft />
        </div>
        <div onClick={() => goToPreviousPage(1)}>
          <HiChevronLeft />
        </div>
      </div>
      <button className="today-button" onClick={goToday}>
        Today
      </button>
      <div className="pagination-next">
        <div onClick={() => goToNextPage(1)}>
          <HiChevronRight />
        </div>
        <div onClick={() => goToNextPage(7)}>
          <HiChevronDoubleRight />
        </div>
      </div>
    </div>
  );
}
