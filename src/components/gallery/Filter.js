import React, { Component } from 'react';
import SelectControl from '../SelectControl';
import { FaSearch, FaRegTimesCircle } from 'react-icons/fa';
import { DebounceInput } from 'react-debounce-input';

const filterOptions = [
  // { value: 'Most Viewed', label: 'Most Viewed' },
  { value: 1, label: 'Top Rated' },
  { value: 2, label: 'Recently Added' }
];

export default class Filter extends Component {
  render() {
    const { handleChange, sort, onSearch, search, deleteSearch } = this.props;
    return (
      <div className="gallery_filter">
        <div className="gallery_filter-select">
          <SelectControl
            isSearchable={false}
            clearable={false}
            value={filterOptions[sort - 1]}
            defaultValue={filterOptions[sort - 1]}
            onChange={handleChange}
            options={filterOptions}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,

                primary: '#79c2e9'
              }
            })}
          />
        </div>
        <div className="InputAddOn">
          <span className="InputAddOn-item-left">
            <FaSearch />
          </span>
          <DebounceInput
            minLength={2}
            className="InputAddOn-field"
            type="text"
            value={search}
            placeholder="Search public Monograms"
            debounceTimeout={500}
            onChange={event => onSearch(event.target.value)}
          />

          <span className="InputAddOn-item-right">
            {!!search.length && <FaRegTimesCircle onClick={deleteSearch} />}
          </span>
        </div>
      </div>
    );
  }
}
