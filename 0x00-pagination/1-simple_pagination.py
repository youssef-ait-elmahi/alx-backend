#!/usr/bin/env python3
"""
This module contains a class named Server
"""

import csv
import math
from typing import List


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Get page of the dataset
        """
        # Copy index_range from the previous task
        def index_range(page: int, page_size: int) -> Tuple[int, int]:
            """
            This function takes two integer arguments page and page_size
            and returns a tuple of size two containing a start index and an end index
            corresponding to the range of indexes to return in a list for those
            particular pagination parameters.

            Page numbers are 1-indexed, i.e. the first page is page 1.
            """
            start_index = (page - 1) * page_size
            end_index = page * page_size
            return (start_index, end_index)

        # Use assert to verify that both arguments are integers greater than 0
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        # Use index_range to find the correct indexes to paginate the dataset correctly
        start_index, end_index = index_range(page, page_size)

        # Return the appropriate page of the dataset
        return self.dataset()[start_index:end_index]
