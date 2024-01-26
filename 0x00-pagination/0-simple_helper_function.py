#!/usr/bin/env python3
"""
This module contains a function named index_range
"""

from typing import Tuple


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
