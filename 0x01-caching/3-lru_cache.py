#!/usr/bin/env python3
""" LRUCache module """
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ LRUCache class:
    - Inherits from BaseCaching.
    - This caching system uses a LRU algorithm.
    """

    def __init__(self):
        """ Initialize """
        super().__init__()
        self.keys = []

    def put(self, key, item):
        """
        Assign to the dictionary self.cache_data the item
        value for the key key.
        If key or item is None, this method should not do anything.
        If the number of items in self.cache_data is higher
        that BaseCaching.MAX_ITEMS:
        you must discard the least recently used item (LRU algorithm)
        you must print DISCARD: with the key discarded and
        following by a new line
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.keys.remove(key)
            elif len(self.keys) >= self.MAX_ITEMS:
                discarded_key = self.keys.pop(0)
                del self.cache_data[discarded_key]
                print(f"DISCARD: {discarded_key}")
            self.cache_data[key] = item
            self.keys.append(key)

    def get(self, key):
        """
        Return the value in self.cache_data linked to key.
        If key is None or if the key doesn’t exist in
        self.cache_data, return None.
        """
        if key is not None and key in self.cache_data:
            self.keys.remove(key)
            self.keys.append(key)
        return self.cache_data.get(key) if key is not None else None
