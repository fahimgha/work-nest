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
      <button className="today-button" onClick={goToday}>
        Today
      </button>
      <div>
        <div className="pagination-previous">
          <div onClick={() => goToPreviousPage(7)}>
            <HiChevronDoubleLeft cursor="pointer" />
          </div>
          <div onClick={() => goToPreviousPage(1)}>
            <HiChevronLeft cursor="pointer" />
          </div>
        </div>

        <div className="pagination-next">
          <div onClick={() => goToNextPage(1)}>
            <HiChevronRight cursor="pointer" />
          </div>
          <div onClick={() => goToNextPage(7)}>
            <HiChevronDoubleRight cursor="pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
