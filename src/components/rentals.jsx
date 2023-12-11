import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "./common/pagination";
import { getRentals, deleteRental } from "../services/rentalService";
import { paginate } from "../utils/paginate";
import RentalsTable from "./rentalsTable";
import SearchBox from "./searchBox";
import _ from "lodash";

class Rentals extends Component {
  state = {
    rentals: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: rentals } = await getRentals();
    this.setState({ rentals });
  }

  handleDelete = async (rental) => {
    const originalRentals = this.state.rentals;
    const rentals = originalRentals.filter((r) => r._id !== rental._id);
    this.setState({ rentals });

    try {
      await deleteRental(rental._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This rental has already been deleted.");
      this.setState({ originalRentals });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      rentals: allRentals,
    } = this.state;

    let filtered = allRentals;
    if (searchQuery)
      filtered = allRentals.filter((r) =>
        r.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const rentals = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: rentals };
  };

  render() {
    const { length: count } = this.state.rentals;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    // if (count === 0) return <p>There are no rentals in the database.</p>;

    const { totalCount, data: rentals } = this.getPagedData();

    return (
      <div>
        {user && (
          <Link
            to="/rentals/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Rental
          </Link>
        )}
        <p>Showing {totalCount} rentals in the database.</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <RentalsTable
          rentals={rentals}
          sortColumn={sortColumn}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Rentals;
