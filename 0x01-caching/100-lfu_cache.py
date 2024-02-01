#!/usr/bin/env python3
""" LFUCache module """
from base_caching import BaseCaching
from collections import Counter


class LFUCache(BaseCaching):
    """ LFUCache class:
    - Inherits from BaseCaching.
    - This caching system uses a LFU algorithm.
    """

    def __init__(self):
        """ Initialize """
        super().__init__()
        self.keys = []
        self.counts = Counter()

    def put(self, key, item):
        """
        Assign to the dictionary self.cache_data the
        item value for the key key.
        If key or item is None, this method should not do anything.
        If the number of items in self.cache_data is higher
        that BaseCaching.MAX_ITEMS:
        you must discard the least frequency used item (LFU algorithm)
        if you find more than 1 item to discard, you must use the LRU algorithm
        to discard only the least recently used
        you must print DISCARD: with the key discarded and
        following by a new line
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.keys.remove(key)
                self.counts[key] += 1
            elif len(self.keys) >= self.MAX_ITEMS:
                least_frequent = min(self.counts, key=self.counts.get)
                if self.counts[least_frequent] > 1:
                    least_frequent = self.keys[0]
                self.keys.remove(least_frequent)
                del self.cache_data[least_frequent]
                del self.counts[least_frequent]
                print(f"DISCARD: {least_frequent}")
            self.cache_data[key] = item
            self.keys.append(key)
            self.counts[key] = 1

    def get(self, key):
        """
        Return the value in self.cache_data linked to key.
        If key is None or if the key doesn't exist in
        self.cache_data, return None.
        """
        if key is not None and key in self.cache_data:
            self.keys.remove(key)
            self.keys.append(key)
            self.counts[key] += 1
        return self.cache_data.get(key) if key is not None else None
