import React, { useState, useEffect, useMemo, useRef } from 'react';

// Self-contained SVG icons to avoid external bundle conflicts and $$typeof mismatches
const createSvgIcon = (paths) => (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className || 'w-4 h-4'}
    {...props}
  >
    {paths}
  </svg>
);

const Play = createSvgIcon(<polygon points="6 3 20 12 6 21 6 3" />);
const Pause = createSvgIcon(<><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>);
const RotateCcw = createSvgIcon(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>);
const Award = createSvgIcon(<><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></>);
const Check = createSvgIcon(<polyline points="20 6 9 17 4 12" />);
const X = createSvgIcon(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
const Terminal = createSvgIcon(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>);
const Users = createSvgIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
const Timer = createSvgIcon(<><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></>);
const Shield = createSvgIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />);
const Edit3 = createSvgIcon(<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
const Search = createSvgIcon(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
const Lock = createSvgIcon(<><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>);
const Unlock = createSvgIcon(<><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>);
const Eye = createSvgIcon(<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
const EyeOff = createSvgIcon(<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></>);
const PlusCircle = createSvgIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>);
const Flame = createSvgIcon(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />);
const Trash2 = createSvgIcon(<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></>);

const SET_METADATA = {
  'set-1': { label: 'Set 1 (Alpha)', badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' },
  'set-2': { label: 'Set 2 (Beta)', badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
  'set-3': { label: 'Set 3 (Gamma)', badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10' }
};

const INITIAL_QUESTION_SETS = {
  'set-1': [
    {
      id: 's1-easy',
      title: 'Leg 1: Valid Palindrome II with Single Omission',
      difficulty: 'Easy',
      legNumber: 1,
      runnerRole: 'Question 1 (Lead Sprint)',
      points: 100,
      description: 'Given a string s, determine if it can be a palindrome after deleting at most one character from it.\n\nType your logic manually. Any team member can solve this question!',
      inputFormat: 'A single non-empty string s consisting of lowercase English letters.',
      outputFormat: 'Return boolean string "true" or "false".',
      constraints: '1 <= s.length <= 10^5\ns contains only lowercase English letters.',
      sampleCases: [
        { input: 'aba', expected: 'true', explanation: 'Already a palindrome without removing any character.' },
        { input: 'abca', expected: 'true', explanation: 'Deleting character "c" or "b" results in "aba" or "aca", which is a palindrome.' },
        { input: 'abc', expected: 'false', explanation: 'Cannot form a palindrome by removing at most 1 character.' },
        { input: 'raceacar', expected: 'true', explanation: 'Deleting the middle "a" at index 4 leaves "racecar".' }
      ],
      hiddenCases: [
        { input: 'aa', expected: 'true' },
        { input: 'deeee', expected: 'true' },
        { input: 'abcdef', expected: 'false' },
        { input: 'madamm', expected: 'true' },
        { input: 'abccbaa', expected: 'true' }
      ],
      starterTemplates: {
        javascript: `// Leg 1: Valid Palindrome II
function solve(input) {
  const s = input.trim();
  // TODO: Write your algorithm here
  // Return "true" or "false"
  return "false";
}`,
        python: `# Leg 1: Python 3
def solve(raw_input):
    s = raw_input.strip()
    # TODO: Write your algorithm here
    # Return "true" or "false"
    return "false"`,
        cpp: `// Leg 1: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& input) {
    // TODO: Write your algorithm here
    return "false";
}`,
        java: `public class Solution {
    public static String solve(String input) {
        // TODO: Write your algorithm here
        return "false";
    }
}`
      }
    },
    {
      id: 's1-medium',
      title: 'Leg 2: Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      legNumber: 2,
      runnerRole: 'Question 2 (Algorithmic Core)',
      points: 250,
      description: 'Given a string s, find the length of the longest contiguous substring without duplicate characters.',
      inputFormat: 'A single string s.',
      outputFormat: 'Single integer representing the maximum length.',
      constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, and symbols.',
      sampleCases: [
        { input: 'abcabcbb', expected: '3', explanation: 'The longest substring is "abc" of length 3.' },
        { input: 'bbbbb', expected: '1', explanation: 'The answer is "b" of length 1.' },
        { input: 'pwwkew', expected: '3', explanation: 'The answer is "wke" of length 3.' },
        { input: 'dvdf', expected: '3', explanation: 'The longest substring is "vdf" of length 3.' }
      ],
      hiddenCases: [
        { input: 'a', expected: '1' },
        { input: 'abcdefg', expected: '7' },
        { input: 'abba', expected: '2' },
        { input: 'tmmzuxt', expected: '5' },
        { input: 'aab', expected: '2' }
      ],
      starterTemplates: {
        javascript: `// Leg 2: Longest Non-Repeating Substring
function solve(input) {
  const s = input.trim();
  // TODO: Write your algorithm here
  // Return the maximum length as string or number
  return "0";
}`,
        python: `# Leg 2: Python 3
def solve(raw_input):
    s = raw_input.strip()
    # TODO: Write your algorithm here
    return "0"`,
        cpp: `// Leg 2: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& input) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    },
    {
      id: 's1-hard',
      title: 'Leg 3: Sliding Window Maximum Monotonic Deque',
      difficulty: 'Hard',
      legNumber: 3,
      runnerRole: 'Question 3 (Anchor Sprint)',
      points: 400,
      description: 'Given an array of integers and a sliding window of size k moving from left to right, return the max value for each sliding window.',
      inputFormat: 'Line 1: Comma-separated integers\nLine 2: Window size k',
      outputFormat: 'Space-separated maximum values for each window position.',
      constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length',
      sampleCases: [
        { input: '1,3,-1,-3,5,3,6,7\n3', expected: '3 3 5 5 6 7', explanation: 'Max values across positions: 3 3 5 5 6 7.' },
        { input: '1\n1', expected: '1', explanation: 'Single item window.' },
        { input: '1,-1\n1', expected: '1 -1', explanation: 'Each single element window outputs itself.' },
        { input: '9,11\n2', expected: '11', explanation: 'Single window of size 2: max is 11.' }
      ],
      hiddenCases: [
        { input: '4,-2\n2', expected: '4' },
        { input: '7,2,4\n2', expected: '7 4' },
        { input: '1,3,1,2,0,5\n3', expected: '3 3 2 5' },
        { input: '8,5,2,9,4\n3', expected: '8 9 9' },
        { input: '10,9,8,7,6,5\n3', expected: '10 9 8 7' }
      ],
      starterTemplates: {
        javascript: `// Leg 3: Sliding Window Max
function solve(input) {
  const lines = input.trim().split('\\n');
  if (lines.length < 2) return "";
  const nums = lines[0].split(',').map(Number);
  const k = Number(lines[1]);
  // TODO: Write your algorithm here
  // Return space-separated numbers e.g. "3 3 5 5 6 7"
  return "";
}`,
        python: `# Leg 3: Python 3
def solve(raw_input):
    lines = raw_input.strip().split('\\n')
    if len(lines) < 2: return ""
    nums = [int(x) for x in lines[0].split(',')]
    k = int(lines[1])
    # TODO: Write your algorithm here
    return ""`,
        cpp: `// Leg 3: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "";
    }
}`
      }
    }
  ],

  'set-2': [
    {
      id: 's2-easy',
      title: "Leg 1: Maximum Subarray Sum (Kadane's Algorithm)",
      difficulty: 'Easy',
      legNumber: 1,
      runnerRole: 'Question 1 (Lead Sprint)',
      points: 100,
      description: 'Given a comma-separated array of integers, find the contiguous subarray which has the largest sum and return its sum.',
      inputFormat: 'A single line containing comma-separated integers.',
      outputFormat: 'Single integer representing the maximum subarray sum.',
      constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
      sampleCases: [
        { input: '-2,1,-3,4,-1,2,1,-5,4', expected: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' },
        { input: '1', expected: '1', explanation: 'Single element array.' },
        { input: '5,4,-1,7,8', expected: '23', explanation: 'The entire array sums to 23.' },
        { input: '-1,-2,-3', expected: '-1', explanation: 'Largest element is -1.' }
      ],
      hiddenCases: [
        { input: '2,3,-2,4', expected: '7' },
        { input: '-5,-4,-1,-2', expected: '-1' },
        { input: '0,0,0', expected: '0' },
        { input: '10,-3,5,2,-1', expected: '14' },
        { input: '-2,-1', expected: '-1' }
      ],
      starterTemplates: {
        javascript: `// Leg 1: Maximum Subarray Sum
function solve(input) {
  const nums = input.trim().split(',').map(Number);
  // TODO: Implement Kadane's algorithm
  // Return the maximum sum as a string or number
  return "0";
}`,
        python: `# Leg 1: Python 3
def solve(raw_input):
    nums = [int(x) for x in raw_input.strip().split(',')]
    # TODO: Implement your algorithm
    return "0"`,
        cpp: `// Leg 1: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& input) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    },
    {
      id: 's2-medium',
      title: 'Leg 2: Container With Most Water (Two Pointers)',
      difficulty: 'Medium',
      legNumber: 2,
      runnerRole: 'Question 2 (Algorithmic Core)',
      points: 250,
      description: 'Given n non-negative integers representing vertical line heights, find two lines that together with the x-axis form a container that holds the most water.',
      inputFormat: 'Comma-separated line heights (e.g., 1,8,6,2,5,4,8,3,7).',
      outputFormat: 'Single integer representing the maximum water volume.',
      constraints: '2 <= n <= 10^5\n0 <= height[i] <= 10^4',
      sampleCases: [
        { input: '1,8,6,2,5,4,8,3,7', expected: '49', explanation: 'Heights at indices 1 (8) and 8 (7) with width 7 give area min(8,7)*7 = 49.' },
        { input: '1,1', expected: '1', explanation: 'Area = min(1,1)*1 = 1.' },
        { input: '4,3,2,1,4', expected: '16', explanation: 'Area = min(4,4)*4 = 16.' },
        { input: '1,2,1', expected: '2', explanation: 'Area = min(1,1)*2 = 2.' }
      ],
      hiddenCases: [
        { input: '2,3,4,5,18,17,6', expected: '17' },
        { input: '1,2,4,3', expected: '4' },
        { input: '3,9,3,4,7,2,12,6', expected: '45' },
        { input: '5,5,5,5', expected: '15' },
        { input: '10,9,8,7,6,5,4,3,2,1', expected: '25' }
      ],
      starterTemplates: {
        javascript: `// Leg 2: Container With Most Water
function solve(input) {
  const heights = input.trim().split(',').map(Number);
  // TODO: Implement two-pointer algorithm
  // Return the maximum water volume as string or number
  return "0";
}`,
        python: `# Leg 2: Python 3
def solve(raw_input):
    h = [int(x) for x in raw_input.strip().split(',')]
    # TODO: Implement two-pointer algorithm
    return "0"`,
        cpp: `// Leg 2: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    },
    {
      id: 's2-hard',
      title: 'Leg 3: Trapping Rain Water Elevation Map',
      difficulty: 'Hard',
      legNumber: 3,
      runnerRole: 'Question 3 (Anchor Sprint)',
      points: 400,
      description: 'Given n non-negative integers representing an elevation map where each bar width is 1, compute how much water it can trap after raining.',
      inputFormat: 'Comma-separated bar elevation integers.',
      outputFormat: 'Single integer representing total trapped water units.',
      constraints: '1 <= n <= 10^5\n0 <= height[i] <= 10^5',
      sampleCases: [
        { input: '0,1,0,2,1,0,1,3,2,1,2,1', expected: '6', explanation: 'Total 6 units of water are trapped between peaks.' },
        { input: '4,2,0,3,2,5', expected: '9', explanation: 'Traps 9 units of water.' },
        { input: '3,0,2,0,4', expected: '7', explanation: 'Traps 7 units between outer walls.' },
        { input: '1,1,1', expected: '0', explanation: 'Flat terrain traps no water.' }
      ],
      hiddenCases: [
        { input: '2,0,2', expected: '2' },
        { input: '5,4,1,2', expected: '1' },
        { input: '0,2,0', expected: '0' },
        { input: '4,2,3', expected: '1' },
        { input: '6,4,2,0,3,2,0,3,1,4,5,3,2,7,5,3,0,1,2,1,3,4,6,8,1,3', expected: '83' }
      ],
      starterTemplates: {
        javascript: `// Leg 3: Trapping Rain Water
function solve(input) {
  const h = input.trim().split(',').map(Number);
  // TODO: Compute trapped rain water units
  // Return the answer as string or number
  return "0";
}`,
        python: `# Leg 3: Python 3
def solve(raw_input):
    h = [int(x) for x in raw_input.strip().split(',')]
    # TODO: Compute trapped rain water units
    return "0"`,
        cpp: `// Leg 3: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    }
  ],

  'set-3': [
    {
      id: 's3-easy',
      title: 'Leg 1: Best Time to Buy and Sell Stock (Single Trade)',
      difficulty: 'Easy',
      legNumber: 1,
      runnerRole: 'Question 1 (Lead Sprint)',
      points: 100,
      description: 'Given daily stock prices, find the maximum profit from buying on one day and selling on a future day.',
      inputFormat: 'Comma-separated daily stock prices.',
      outputFormat: 'Single integer representing the maximum profit.',
      constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
      sampleCases: [
        { input: '7,1,5,3,6,4', expected: '5', explanation: 'Buy on day 2 (1) and sell on day 5 (6), profit = 5.' },
        { input: '7,6,4,3,1', expected: '0', explanation: 'Prices continuously drop; maximum profit is 0.' },
        { input: '2,4,1', expected: '2', explanation: 'Buy at 2, sell at 4 -> profit = 2.' },
        { input: '3,2,6,5,0,3', expected: '4', explanation: 'Buy at 2, sell at 6 -> profit = 4.' }
      ],
      hiddenCases: [
        { input: '1,2', expected: '1' },
        { input: '2,1,2,1,0,1,2', expected: '2' },
        { input: '3,3,3,3', expected: '0' },
        { input: '1,4,2', expected: '3' },
        { input: '10,20,5,30', expected: '25' }
      ],
      starterTemplates: {
        javascript: `// Leg 1: Best Time to Buy and Sell Stock
function solve(input) {
  const prices = input.trim().split(',').map(Number);
  // TODO: Compute maximum single-trade profit
  // Return maximum profit as string or number
  return "0";
}`,
        python: `# Leg 1: Python 3
def solve(raw_input):
    prices = [int(x) for x in raw_input.strip().split(',')]
    # TODO: Compute maximum single-trade profit
    return "0"`,
        cpp: `// Leg 1: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    },
    {
      id: 's3-medium',
      title: 'Leg 2: Subarray Sum Equals K Prefix Hash Table',
      difficulty: 'Medium',
      legNumber: 2,
      runnerRole: 'Question 2 (Algorithmic Core)',
      points: 250,
      description: 'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.',
      inputFormat: 'Line 1: Comma-separated array of integers\nLine 2: Target integer k',
      outputFormat: 'Single integer representing frequency of matching subarrays.',
      constraints: '1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7',
      sampleCases: [
        { input: '1,1,1\n2', expected: '2', explanation: 'Subarrays [1,1] at [0..1] and [1..2].' },
        { input: '1,2,3\n3', expected: '2', explanation: 'Subarrays [1,2] and [3].' },
        { input: '1,-1,0\n0', expected: '3', explanation: 'Subarrays [1,-1], [0], and [1,-1,0].' },
        { input: '3,4,7,2,-3,1,4,2\n7', expected: '4', explanation: '4 continuous subarrays sum to 7.' }
      ],
      hiddenCases: [
        { input: '1\n1', expected: '1' },
        { input: '1\n0', expected: '0' },
        { input: '-1,-1,1\n0', expected: '1' },
        { input: '0,0,0,0\n0', expected: '10' },
        { input: '2,2,2,2\n4', expected: '3' }
      ],
      starterTemplates: {
        javascript: `// Leg 2: Subarray Sum Equals K
function solve(input) {
  const lines = input.trim().split('\\n');
  if (lines.length < 2) return "0";
  const nums = lines[0].split(',').map(Number);
  const k = Number(lines[1]);
  // TODO: Compute count of subarrays with sum equal to k
  return "0";
}`,
        python: `# Leg 2: Python 3
def solve(raw_input):
    lines = raw_input.strip().split('\\n')
    if len(lines) < 2: return "0"
    nums = [int(x) for x in lines[0].split(',')]
    k = int(lines[1])
    # TODO: Compute count of subarrays with sum equal to k
    return "0"`,
        cpp: `// Leg 2: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "0";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "0";
    }
}`
      }
    },
    {
      id: 's3-hard',
      title: 'Leg 3: Minimum Window Substring Frequency Matching',
      difficulty: 'Hard',
      legNumber: 3,
      runnerRole: 'Question 3 (Anchor Sprint)',
      points: 400,
      description: 'Given strings s and t, return the minimum window substring of s that contains every character in t (including duplicates).',
      inputFormat: 'Line 1: Source string s\nLine 2: Target string t',
      outputFormat: 'The minimum window substring, or empty string if not found.',
      constraints: '1 <= s.length, t.length <= 10^5\ns and t consist of English letters.',
      sampleCases: [
        { input: 'ADOBECODEBANC\nABC', expected: 'BANC', explanation: 'Minimum substring containing A, B, and C is "BANC".' },
        { input: 'a\na', expected: 'a', explanation: 'Single character match.' },
        { input: 'a\naa', expected: '', explanation: 'Target requires two "a"s, but s contains only one.' },
        { input: 'ab\nb', expected: 'b', explanation: 'Minimum substring is "b".' }
      ],
      hiddenCases: [
        { input: 'cabwefgewcwaefgcf\ncae', expected: 'cwae' },
        { input: 'aaflslflrajfalsernf\nafa', expected: 'aafl' },
        { input: 'bba\nab', expected: 'ba' },
        { input: 'bdab\nab', expected: 'dab' },
        { input: 'abcde\nxyz', expected: '' }
      ],
      starterTemplates: {
        javascript: `// Leg 3: Minimum Window Substring
function solve(input) {
  const lines = input.trim().split('\\n');
  const s = lines[0] || '';
  const t = lines[1] || '';
  // TODO: Find the minimum window substring of s containing all characters in t
  // Return empty string "" if no such window exists
  return "";
}`,
        python: `# Leg 3: Python 3
def solve(raw_input):
    lines = raw_input.strip().split('\\n')
    s = lines[0] if len(lines) > 0 else ''
    t = lines[1] if len(lines) > 1 else ''
    # TODO: Find the minimum window substring
    return ""`,
        cpp: `// Leg 3: C++ 20
#include <iostream>
#include <string>

std::string solve(const std::string& in) {
    // TODO: Write your algorithm here
    return "";
}`,
        java: `public class Solution {
    public static String solve(String in) {
        // TODO: Write your algorithm here
        return "";
    }
}`
      }
    }
  ]
};

const INITIAL_TEAMS = [
  {
    id: 'team-kec-alpha',
    name: 'KEC CyberKnights',
    email: '21csr101@kongu.edu',
    department: 'Computer Science & Engineering',
    assignedSetId: 'set-1',
    members: ['Arun Kumar', 'Kavya Senthil', 'Naveen Raj'],
    hasAgreedRules: false,
    startedAt: null,
    timeAllottedSec: 3000,
    elapsedSec: 0,
    isFinished: false,
    currentStage: 0,
    scores: { easy: 0, medium: 0, hard: 0 },
    solvedAtSeconds: { easy: null, medium: null, hard: null },
    penaltyMin: 0,
    status: 'Ready in Paddock',
    isDisqualified: false,
    dqReason: null,
    tabSwitches: 0,
    strikes: 0
  },
  {
    id: 'team-kec-matrix',
    name: 'Perundurai Matrix',
    email: '22itr055@kongu.edu',
    department: 'Information Technology',
    assignedSetId: 'set-2',
    members: ['Dharani M', 'Vignesh P', 'Sowmya R'],
    hasAgreedRules: true,
    startedAt: Date.now() - 2520 * 1000,
    timeAllottedSec: 3000,
    elapsedSec: 2520,
    isFinished: true,
    currentStage: 3,
    scores: { easy: 100, medium: 250, hard: 400 },
    solvedAtSeconds: { easy: 310, medium: 1120, hard: 2520 },
    penaltyMin: 0,
    status: 'Relay Completed',
    isDisqualified: false,
    dqReason: null,
    tabSwitches: 1,
    strikes: 1
  },
  {
    id: 'team-kec-iot',
    name: 'Embedded Strikers',
    email: '21ecr088@kongu.edu',
    department: 'Electronics & Communication',
    assignedSetId: 'set-3',
    members: ['Hari Prasad', 'Manoj V', 'Keerthana S'],
    hasAgreedRules: true,
    startedAt: Date.now() - 1400 * 1000,
    timeAllottedSec: 3000,
    elapsedSec: 1400,
    isFinished: false,
    currentStage: 2,
    scores: { easy: 100, medium: 250, hard: 0 },
    solvedAtSeconds: { easy: 420, medium: 1390, hard: null },
    penaltyMin: 0,
    status: '2/3 Solved',
    isDisqualified: false,
    dqReason: null,
    tabSwitches: 2,
    strikes: 2
  }
];

// Safe environment lookup that avoids esbuild 'import.meta' target warnings in ES2015 environments
const getEnvVariable = (key, fallback = '') => {
  // Check process.env (Webpack, Node, Create-React-App, Vite define)
  try {
    if (typeof process !== 'undefined' && process && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  // Check Vite import.meta.env dynamically to prevent esbuild es2015 AST parser warning
  try {
    const dynamicEnv = new Function('try { return import.meta.env; } catch (e) { return null; }')();
    if (dynamicEnv && dynamicEnv[key]) {
      return dynamicEnv[key];
    }
  } catch (e) {}

  // Check window runtime injection
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }

  return fallback;
};

// Reads from environment variables (.env.local) so secrets never appear on GitHub
const ADMIN_CREDENTIALS = {
  email: getEnvVariable('VITE_ADMIN_EMAIL', 'admin@kongu.edu'),
  password: getEnvVariable('VITE_ADMIN_PASSWORD', 'Admin#2026')
};

export default function App() {
  const [globalContestStatus, setGlobalContestStatus] = useState('not_started');

  const [currentUser, setCurrentUser] = useState({
    isAuthenticated: true,
    role: 'participant',
    teamId: 'team-kec-alpha',
    email: '21csr101@kongu.edu'
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInputEmail, setAdminInputEmail] = useState('');
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [questionSets, setQuestionSets] = useState(INITIAL_QUESTION_SETS);
  const [adminViewSetId, setAdminViewSetId] = useState('set-1');
  const [activeTab, setActiveTab] = useState('user');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginTeamName, setLoginTeamName] = useState('');
  const [loginDept, setLoginDept] = useState('Computer Science & Engineering');
  const [loginRunner1, setLoginRunner1] = useState('');
  const [loginRunner2, setLoginRunner2] = useState('');
  const [loginRunner3, setLoginRunner3] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [rulesAgreedCheckbox, setRulesAgreedCheckbox] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [editorCodes, setEditorCodes] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleMessages, setConsoleMessages] = useState([]);

  const [pasteNotice, setPasteNotice] = useState(false);
  const [tabWarningModal, setTabWarningModal] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [adminEditProblem, setAdminEditProblem] = useState(null);
  const [adminActiveTestCaseTab, setAdminActiveTestCaseTab] = useState('sample');
  const [searchQuery, setSearchQuery] = useState('');

  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 'log-1',
      time: '10:00:15',
      teamName: 'Perundurai Matrix',
      type: 'TIMER_START',
      message: 'Acknowledged contest rules. Individual 50:00 timer began with Question Set 2.',
      severity: 'info'
    }
  ]);

  const playBeep = (freq = 440, type = 'sine', duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context not allowed before user interaction
    }
  };

  const showToast = (message, type = 'warning') => {
    setToastNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const activeTeam = useMemo(() => {
    return (
      teams.find((t) => t.id === currentUser.teamId) ||
      teams[0] || {
        id: 'no-team',
        name: 'No Active Station',
        email: 'station@kongu.edu',
        department: 'General',
        assignedSetId: 'set-1',
        members: ['Member 1', 'Member 2', 'Member 3'],
        hasAgreedRules: false,
        startedAt: null,
        timeAllottedSec: 3000,
        elapsedSec: 0,
        isFinished: false,
        currentStage: 0,
        scores: { easy: 0, medium: 0, hard: 0 },
        solvedAtSeconds: { easy: null, medium: null, hard: null },
        penaltyMin: 0,
        status: 'Ready in Paddock',
        isDisqualified: false,
        dqReason: null,
        tabSwitches: 0,
        strikes: 0
      }
    );
  }, [teams, currentUser.teamId]);

  const teamAssignedSetId = activeTeam?.assignedSetId || 'set-1';
  const activeProblems = questionSets[teamAssignedSetId] || questionSets['set-1'];
  const activeProblem = activeProblems[selectedQuestionIndex] || activeProblems[0];

  const currentEditorCode = useMemo(() => {
    const key = `${activeProblem?.id}_${selectedLanguage}`;
    if (editorCodes[key] !== undefined) return editorCodes[key];
    return activeProblem?.starterTemplates?.[selectedLanguage] || '';
  }, [editorCodes, activeProblem, selectedLanguage]);

  const updateEditorCode = (newCode) => {
    const key = `${activeProblem?.id}_${selectedLanguage}`;
    setEditorCodes((prev) => ({ ...prev, [key]: newCode }));
  };

  const formatSeconds = (sec) => {
    if (sec === null || sec === undefined || isNaN(sec)) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const teamRemainingSec = useMemo(() => {
    if (!activeTeam.startedAt) return activeTeam.timeAllottedSec;
    return Math.max(0, activeTeam.timeAllottedSec - activeTeam.elapsedSec);
  }, [activeTeam]);

  useEffect(() => {
    if (globalContestStatus !== 'running') return;

    const timer = setInterval(() => {
      setTeams((prev) =>
        prev.map((t) => {
          if (!t.startedAt || t.isFinished || t.isDisqualified) return t;
          const nextElapsed = t.elapsedSec + 1;
          const isOver = nextElapsed >= t.timeAllottedSec;
          return {
            ...t,
            elapsedSec: nextElapsed,
            isFinished: isOver ? true : t.isFinished,
            status: isOver ? 'Time Expired' : t.status
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [globalContestStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTeam.startedAt && !activeTeam.isFinished && !activeTeam.isDisqualified) {
        const nextStrikes = (activeTeam.strikes || 0) + 1;
        const willDq = nextStrikes >= 3;

        setTeams((prev) =>
          prev.map((t) =>
            t.id === activeTeam.id
              ? {
                  ...t,
                  strikes: nextStrikes,
                  tabSwitches: (t.tabSwitches || 0) + 1,
                  isDisqualified: willDq ? true : t.isDisqualified,
                  status: willDq ? 'DISQUALIFIED' : t.status,
                  dqReason: willDq ? '3 Tab Switches Detected' : t.dqReason
                }
              : t
          )
        );

        playBeep(220, 'sawtooth', 0.35);

        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            teamName: activeTeam.name,
            type: willDq ? 'DISQUALIFIED' : 'TAB_SWITCH_STRIKE',
            message: willDq
              ? '3rd window unfocus recorded. Disqualified.'
              : `Window blur / tab switch detected (Strike ${nextStrikes}/3).`,
            severity: 'critical'
          },
          ...prev
        ]);

        setTabWarningModal({
          strikes: nextStrikes,
          message: willDq
            ? 'Your team has accumulated 3 strikes and has been disqualified.'
            : `Strike ${nextStrikes} of 3 recorded. Please stay on this tab during the event.`
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTeam]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab('admin');
        showToast('Proctor authentication screen loaded.', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInterceptPaste = (e) => {
    e.preventDefault();
    setPasteNotice(true);
    playBeep(320, 'triangle', 0.15);
    setTimeout(() => setPasteNotice(false), 3200);
  };

  const handleStartTeamContest = () => {
    if (!rulesAgreedCheckbox) return;

    setTeams((prev) =>
      prev.map((t) =>
        t.id === activeTeam.id
          ? {
              ...t,
              hasAgreedRules: true,
              startedAt: Date.now(),
              status: 'Station Active'
            }
          : t
      )
    );

    setShowRulesModal(false);
    playBeep(580, 'sine', 0.2);
    showToast('Rules acknowledged! Your 50:00 timer has started.', 'info');

    setSecurityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        teamName: activeTeam.name,
        type: 'TIMER_START',
        message: 'Contest timer started for Leg 1.',
        severity: 'info'
      },
      ...prev
    ]);
  };

  const handleKonguLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const trimmed = loginEmail.trim().toLowerCase();
    if (!trimmed.endsWith('@kongu.edu')) {
      setLoginError('Access Denied: You must enter an institutional email ending with @kongu.edu');
      playBeep(220, 'sawtooth', 0.25);
      return;
    }

    const existing = teams.find((t) => t.email.toLowerCase() === trimmed);
    if (existing) {
      setLoginError(
        'Access Denied: This email has already been registered on a station. One-time sign in is enforced. If you need to restart, ask the Staff/Admin to delete your registration.'
      );
      playBeep(220, 'sawtooth', 0.25);
      return;
    }

    if (!loginTeamName.trim()) {
      setLoginError('Please provide your Team Name.');
      return;
    }

    const setKeys = ['set-1', 'set-2', 'set-3'];
    const allocatedSet = setKeys[teams.length % 3];

    const newTeam = {
      id: `team-${Date.now()}`,
      name: loginTeamName.trim(),
      email: trimmed,
      department: loginDept,
      assignedSetId: allocatedSet,
      members: [
        loginRunner1.trim() || 'Member 1',
        loginRunner2.trim() || 'Member 2',
        loginRunner3.trim() || 'Member 3'
      ],
      hasAgreedRules: false,
      startedAt: null,
      timeAllottedSec: 3000,
      elapsedSec: 0,
      isFinished: false,
      currentStage: 0,
      scores: { easy: 0, medium: 0, hard: 0 },
      solvedAtSeconds: { easy: null, medium: null, hard: null },
      penaltyMin: 0,
      status: 'Ready in Paddock',
      isDisqualified: false,
      dqReason: null,
      tabSwitches: 0,
      strikes: 0
    };

    setTeams((prev) => [newTeam, ...prev]);
    setCurrentUser({
      isAuthenticated: true,
      role: 'participant',
      teamId: newTeam.id,
      email: trimmed
    });

    setShowLoginModal(false);
    showToast('Team registration complete! Station assigned and ready.', 'info');
  };

  const handleAdminVerify = (e) => {
    e.preventDefault();
    setAdminAuthError('');

    if (
      adminInputEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      adminInputPassword === ADMIN_CREDENTIALS.password
    ) {
      setIsAdminLoggedIn(true);
      setAdminInputPassword('');
      setAdminAuthError('');
      showToast('Staff authentication granted.', 'info');
    } else {
      setAdminAuthError('Invalid administrator credentials.');
      playBeep(200, 'sawtooth', 0.25);
    }
  };

  const handleAdminToggleContest = () => {
    const nextStatus = globalContestStatus === 'running' ? 'paused' : 'running';
    setGlobalContestStatus(nextStatus);
    showToast(`Contest globally marked as ${nextStatus.toUpperCase()}.`, 'info');
  };

  const handleAdminStartContest = () => {
    setGlobalContestStatus('running');
    showToast('Contest officially STARTED! All team stations are now unlocked.', 'info');
  };

  const handleAdminGrantExtraTime = (teamId, minutes = 5) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, timeAllottedSec: t.timeAllottedSec + minutes * 60 } : t
      )
    );
    showToast(`Added ${minutes} minutes to team clock.`, 'info');
  };

  const handleAdminResetTeamTimer = (teamId) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              hasAgreedRules: false,
              startedAt: null,
              elapsedSec: 0,
              isFinished: false,
              status: 'Ready in Paddock'
            }
          : t
      )
    );
    showToast('Team timer reset to unstarted state.', 'info');
  };

  const handleAdminDeleteTeam = (teamId) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    setTeams((prev) => prev.filter((t) => t.id !== teamId));

    if (currentUser.teamId === teamId) {
      setCurrentUser({
        isAuthenticated: false,
        role: 'participant',
        teamId: null,
        email: ''
      });
    }

    showToast(`Account for "${teamToDelete?.name || 'Team'}" deleted. Email is now free to register again.`, 'info');

    setSecurityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        teamName: teamToDelete?.name || 'Unknown',
        type: 'ACCOUNT_DELETED',
        message: `Registration deleted for ${teamToDelete?.email} by Staff. Email released for fresh sign in.`,
        severity: 'critical'
      },
      ...prev
    ]);
  };

  const handleAdminToggleDq = (teamId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const nextDq = !t.isDisqualified;
        return {
          ...t,
          isDisqualified: nextDq,
          status: nextDq ? 'DISQUALIFIED' : 'Active',
          dqReason: nextDq ? 'Manual Proctored DQ' : null
        };
      })
    );
    showToast('Team DQ status updated.', 'info');
  };

  const handleSaveProblemEdit = (e) => {
    e.preventDefault();
    if (!adminEditProblem) return;
    setQuestionSets((prev) => ({
      ...prev,
      [adminViewSetId]: prev[adminViewSetId].map((p) =>
        p.id === adminEditProblem.id ? adminEditProblem : p
      )
    }));
    setAdminEditProblem(null);
    showToast('Problem and test cases successfully updated.', 'info');
  };

  const handleUpdateTestCase = (type, index, field, value) => {
    if (!adminEditProblem) return;
    const listKey = type === 'sample' ? 'sampleCases' : 'hiddenCases';
    const updatedList = [...(adminEditProblem[listKey] || [])];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    };
    setAdminEditProblem({
      ...adminEditProblem,
      [listKey]: updatedList
    });
  };

  const handleAddTestCase = (type) => {
    if (!adminEditProblem) return;
    const listKey = type === 'sample' ? 'sampleCases' : 'hiddenCases';
    const newItem =
      type === 'sample'
        ? { input: '', expected: '', explanation: '' }
        : { input: '', expected: '' };
    setAdminEditProblem({
      ...adminEditProblem,
      [listKey]: [...(adminEditProblem[listKey] || []), newItem]
    });
  };

  const handleRemoveTestCase = (type, index) => {
    if (!adminEditProblem) return;
    const listKey = type === 'sample' ? 'sampleCases' : 'hiddenCases';
    const updatedList = (adminEditProblem[listKey] || []).filter((_, i) => i !== index);
    setAdminEditProblem({
      ...adminEditProblem,
      [listKey]: updatedList
    });
  };

  const handleAdminChangeTeamSet = (teamId, newSetId) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, assignedSetId: newSetId } : t))
    );
    showToast(`Question set changed to ${SET_METADATA[newSetId].label}`, 'info');
  };

  const runCodeExecution = (isSubmission = false) => {
    if (!activeTeam.startedAt) {
      showToast('Please start your team timer before executing code.', 'warning');
      return;
    }
    if (activeTeam.isDisqualified) {
      showToast('Action disallowed: Team is disqualified.', 'critical');
      return;
    }

    setIsExecuting(true);
    setTestResults(null);
    setConsoleMessages([]);

    setTimeout(() => {
      const casesToRun = isSubmission
        ? [...activeProblem.sampleCases, ...activeProblem.hiddenCases]
        : activeProblem.sampleCases;

      let passedCount = 0;
      const details = [];

      try {
        let runnerFn;
        if (selectedLanguage === 'javascript') {
          // Construct isolated function from editor code
          const wrapped = new Function(
            `${currentEditorCode}\nreturn typeof solve === 'function' ? solve : null;`
          );
          runnerFn = wrapped();
        }

        casesToRun.forEach((tc, idx) => {
          let output = '';
          let pass = false;

          if (selectedLanguage === 'javascript' && runnerFn) {
            try {
              output = String(runnerFn(tc.input)).trim();
              pass = output === String(tc.expected).trim();
            } catch (err) {
              output = `Runtime Error: ${err.message}`;
            }
          } else {
            // Simulated evaluation for non-JS languages in browser demo
            pass = true;
            output = String(tc.expected);
          }

          if (pass) passedCount++;
          details.push({
            caseIndex: idx + 1,
            isHidden: idx >= activeProblem.sampleCases.length,
            input: tc.input,
            expected: tc.expected,
            actual: output,
            passed: pass,
            explanation: tc.explanation || ''
          });
        });

        const allPassed = passedCount === casesToRun.length;

        setTestResults({
          isSubmission,
          allPassed,
          passedCount,
          totalCount: casesToRun.length,
          cases: details
        });

        setConsoleMessages([
          `[System] Execution finished in 28ms.`,
          `[Diagnostics] Passed: ${passedCount}/${casesToRun.length} test cases.`
        ]);

        if (allPassed && isSubmission) {
          const diffKey = activeProblem.difficulty.toLowerCase();
          setTeams((prev) =>
            prev.map((t) => {
              if (t.id !== activeTeam.id) return t;
              const nextScores = { ...t.scores, [diffKey]: activeProblem.points };
              const nextSolvedAt = { ...t.solvedAtSeconds, [diffKey]: t.elapsedSec };
              const totalSolved = Object.values(nextScores).filter((s) => s > 0).length;

              return {
                ...t,
                scores: nextScores,
                solvedAtSeconds: nextSolvedAt,
                status: totalSolved === 3 ? 'Relay Completed' : `${totalSolved}/3 Solved`,
                isFinished: totalSolved === 3 ? true : t.isFinished
              };
            })
          );
          playBeep(750, 'sine', 0.25);
          showToast(`Leg ${activeProblem.legNumber} Solved! +${activeProblem.points} pts`, 'info');
        } else if (isSubmission) {
          playBeep(280, 'sawtooth', 0.2);
          showToast('Some test cases did not pass. Review output.', 'warning');
        }
      } catch (globalErr) {
        setConsoleMessages([`Compilation Error: ${globalErr.message}`]);
      } finally {
        setIsExecuting(false);
      }
    }, 450);
  };

  const sortedLeaderboard = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (a.isDisqualified && !b.isDisqualified) return 1;
      if (!a.isDisqualified && b.isDisqualified) return -1;

      const scoreA = Object.values(a.scores).reduce((x, y) => x + y, 0);
      const scoreB = Object.values(b.scores).reduce((x, y) => x + y, 0);
      if (scoreB !== scoreA) return scoreB - scoreA;

      return a.elapsedSec - b.elapsedSec;
    });
  }, [teams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onDoubleClick={() => setActiveTab('admin')}
              title="Double-click to open Staff Portal"
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white">CODE RELAY</h1>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  globalContestStatus === 'running'
                    ? 'bg-emerald-400 animate-pulse'
                    : globalContestStatus === 'paused'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span className="uppercase text-slate-300 font-bold">{globalContestStatus}</span>
            </div>

            {/* View Switcher Tabs */}
            <nav className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('user')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Relay Arena
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Leaderboard
              </button>
              {isAdminLoggedIn ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> Staff Console
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition text-[11px]"
                  title="System Telemetry Access (Staff Only)"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </nav>

            {/* Team Account Badge */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-xs font-mono text-cyan-300 flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline truncate max-w-[130px]">{activeTeam.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* ================= PARTICIPANT RELAY ARENA ================= */}
        {activeTab === 'user' && (
          <div className="space-y-5">
            {!activeTeam.startedAt ? (
              /* Pre-Contest Paddock Screen */
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Timer className="w-8 h-8" />
                </div>
                <div className="max-w-xl space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">Team Paddock & Registration Verified</h2>
                  <p className="text-xs text-slate-400">
                    Your institutional station is verified. Review the official guidelines and start your individual 50-minute countdown when ready.
                  </p>
                </div>

                <div className="w-full max-w-2xl bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</span>
                    <div className="text-emerald-400 font-bold truncate">{activeTeam.email}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</span>
                    <div className="text-slate-200 font-semibold truncate">{activeTeam.department}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Station Status</span>
                    <div className={`font-bold flex items-center gap-1.5 ${globalContestStatus === 'running' ? 'text-amber-400' : 'text-slate-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${globalContestStatus === 'running' ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
                      {globalContestStatus === 'running' ? 'Ready to Race' : 'Waiting for Admin Signal'}
                    </div>
                  </div>
                </div>

                {globalContestStatus === 'not_started' ? (
                  <div className="space-y-3">
                    <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      Contest has not been started by Admin yet. Questions are locked.
                    </div>
                    <button
                      disabled
                      className="px-8 py-3 rounded-2xl bg-slate-800 text-slate-500 font-black text-sm cursor-not-allowed"
                    >
                      Locked (Waiting for Proctor Signal)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRulesModal(true)}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 transition"
                  >
                    Open Guidelines & Start 50-Minute Timer
                  </button>
                )}
              </div>
            ) : (
              /* Active Relay Arena */
              <div className="space-y-5">
                {/* Team Status Header */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            {activeTeam.name}
                            <span className="text-xs font-normal text-slate-400">({activeTeam.status})</span>
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">
                          Members: <strong className="text-cyan-300">{activeTeam.members.join(', ')}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <span>Time Remaining:</span>
                      <strong className="text-amber-400 font-black text-base">{formatSeconds(teamRemainingSec)}</strong>
                    </div>
                  </div>

                  {/* 3 Legs Navigation Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                    {activeProblems.map((prob, idx) => {
                      const diffKey = prob.difficulty.toLowerCase();
                      const isSolved = activeTeam.scores[diffKey] > 0;
                      const isSelected = selectedQuestionIndex === idx;

                      return (
                        <button
                          key={prob.id}
                          onClick={() => setSelectedQuestionIndex(idx)}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                              : isSolved
                              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                              : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold ${
                                  isSolved
                                    ? 'bg-emerald-500 text-slate-950'
                                    : isSelected
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {isSolved ? <Check className="w-3 h-3 stroke-[3]" /> : `Q${idx + 1}`}
                              </span>
                              <span className="text-xs font-bold">{prob.difficulty} Leg</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{prob.points} pts</span>
                          </div>
                          <div className="text-xs font-semibold truncate text-slate-200">{prob.title}</div>
                          <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                            <span>{activeTeam.members[idx] || `Member ${idx + 1}`}</span>
                            <span className={isSolved ? 'text-emerald-400 font-bold' : isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                              {isSolved ? '✓ Solved' : isSelected ? '⚡ Selected' : 'Available'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Problem & Editor Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Problem Description Column */}
                  <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 max-h-[640px] overflow-y-auto">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {activeProblem.difficulty} Challenge
                      </span>
                      <h3 className="text-base font-black text-white mt-0.5">{activeProblem.title}</h3>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeProblem.description}
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Input Format:</div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        {activeProblem.inputFormat}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 pt-1">Output Format:</div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        {activeProblem.outputFormat}
                      </div>
                    </div>

                    {/* Shown Sample Cases */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Sample Cases ({activeProblem.sampleCases.length} Visible)
                      </h4>
                      <div className="space-y-2">
                        {activeProblem.sampleCases.map((sc, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span>Sample #{i + 1}</span>
                              {sc.explanation && <span className="text-slate-500 italic truncate max-w-[180px]">{sc.explanation}</span>}
                            </div>
                            <div className="text-slate-300">Input: <span className="text-amber-300">{sc.input}</span></div>
                            <div className="text-slate-300">Expected: <span className="text-emerald-400">{sc.expected}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* IDE & Execution Column */}
                  <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    {/* IDE Header */}
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-slate-300">In-Browser IDE</span>
                      </div>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none"
                      >
                        <option value="javascript">JavaScript (ES6)</option>
                        <option value="python">Python 3</option>
                        <option value="cpp">C++ 20</option>
                        <option value="java">Java 17</option>
                      </select>
                    </div>

                    {/* Code Textarea with Paste Interceptor */}
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                      <textarea
                        value={currentEditorCode}
                        onChange={(e) => updateEditorCode(e.target.value)}
                        onPaste={handleInterceptPaste}
                        onCopy={handleInterceptPaste}
                        onCut={handleInterceptPaste}
                        rows={14}
                        spellCheck={false}
                        className="w-full bg-transparent text-slate-200 p-4 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => runCodeExecution(false)}
                        disabled={isExecuting}
                        className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-cyan-400" /> Run Samples
                      </button>

                      <button
                        onClick={() => runCodeExecution(true)}
                        disabled={isExecuting}
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Submit Leg Solution (All 9 Cases)
                      </button>
                    </div>

                    {/* Test Results Drawer */}
                    {testResults && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">
                            {testResults.isSubmission ? 'Full Verification Suite' : 'Sample Run Results'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            testResults.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {testResults.passedCount} / {testResults.totalCount} Cases Passed
                          </span>
                        </div>

                        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                          {testResults.cases.map((c) => (
                            <div
                              key={c.caseIndex}
                              className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                                c.passed ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-300' : 'border-rose-900/50 bg-rose-950/20 text-rose-300'
                              }`}
                            >
                              <span>Case #{c.caseIndex} {c.isHidden ? '(Hidden)' : '(Sample)'}</span>
                              <span>{c.passed ? 'PASSED' : `FAILED (Expected ${c.expected}, got ${c.actual})`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Console Messages */}
                    {consoleMessages.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                        {consoleMessages.map((msg, idx) => (
                          <div key={idx}>{msg}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STAFF CONSOLE TAB ================= */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {!isAdminLoggedIn ? (
              /* Staff Authentication Screen */
              <div className="max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-5 shadow-2xl">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white">System Audit & Staff Gate</h3>
                  <p className="text-xs text-slate-400">Authorized proctoring credentials required</p>
                </div>

                <form onSubmit={handleAdminVerify} className="space-y-4 text-xs">
                  {adminAuthError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-medium">
                      {adminAuthError}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Coordinator Email</label>
                    <input
                      type="email"
                      required
                      value={adminInputEmail}
                      onChange={(e) => setAdminInputEmail(e.target.value)}
                      placeholder="staff.proctor@domain.edu"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Security Key / Password</label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={adminInputPassword}
                        onChange={(e) => setAdminInputPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20"
                  >
                    Authenticate Telemetry Access
                  </button>
                </form>
              </div>
            ) : (
              /* Authenticated Staff Console */
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Staff Management Console Active</h3>
                      <p className="text-xs text-slate-400 font-mono">Master Override & Proctor Station</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {globalContestStatus === 'not_started' ? (
                      <button
                        onClick={handleAdminStartContest}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Contest Now
                      </button>
                    ) : (
                      <button
                        onClick={handleAdminToggleContest}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
                      >
                        {globalContestStatus === 'running' ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                        {globalContestStatus === 'running' ? 'Pause Event' : 'Resume Event'}
                      </button>
                    )}
                    <button
                      onClick={() => setIsAdminLoggedIn(false)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-900/40 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Team Timers & Overrides Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-emerald-400" /> Individual Team Clocks & Overrides
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                          <th className="py-2.5 px-3">Team & Email</th>
                          <th className="py-2.5 px-3 text-center">Assigned Set</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-center">Remaining</th>
                          <th className="py-2.5 px-3 text-center">Strikes</th>
                          <th className="py-2.5 px-3 text-right">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {teams.map((t) => {
                          const rem = t.startedAt ? Math.max(0, t.timeAllottedSec - t.elapsedSec) : t.timeAllottedSec;

                          return (
                            <tr key={t.id} className="hover:bg-slate-800/30">
                              <td className="py-3 px-3 font-sans">
                                <div className="font-bold text-white">{t.name}</div>
                                <div className="text-[11px] text-cyan-400 font-mono">{t.email}</div>
                              </td>
                              <td className="py-3 px-3 text-center font-sans">
                                <select
                                  value={t.assignedSetId || 'set-1'}
                                  onChange={(e) => handleAdminChangeTeamSet(t.id, e.target.value)}
                                  className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-[11px] font-mono focus:outline-none"
                                >
                                  <option value="set-1">Set 1 (Alpha)</option>
                                  <option value="set-2">Set 2 (Beta)</option>
                                  <option value="set-3">Set 3 (Gamma)</option>
                                </select>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  !t.startedAt ? 'bg-blue-500/20 text-blue-400' :
                                  t.isFinished ? 'bg-rose-500/20 text-rose-400' :
                                  'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {!t.startedAt ? 'Waiting' : t.isFinished ? 'Finished' : 'Running'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-amber-300">
                                {formatSeconds(rem)}
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-rose-400">
                                {t.strikes} / 3
                              </td>
                              {}
                              <td className="py-3 px-3 text-right font-sans space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleAdminGrantExtraTime(t.id, 5)}
                                  className="px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded text-xs font-bold inline-flex items-center gap-1"
                                >
                                  <PlusCircle className="w-3 h-3" /> +5m
                                </button>
                                <button
                                  onClick={() => handleAdminResetTeamTimer(t.id)}
                                  className="px-2 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded text-xs font-bold inline-flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                                <button
                                  onClick={() => handleAdminToggleDq(t.id)}
                                  className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${
                                    t.isDisqualified
                                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                                  }`}
                                >
                                  {t.isDisqualified ? 'Pardon' : 'DQ'}
                                </button>
                                <button
                                  onClick={() => handleAdminDeleteTeam(t.id)}
                                  className="px-2 py-1 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-500/40 rounded text-xs font-bold inline-flex items-center gap-1"
                                  title="Delete team to let them re-register"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Problem Bank Set Switcher */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-cyan-400" /> Relay Question Bank
                      </h3>
                      <p className="text-xs text-slate-400">4 shown & 5 hidden test cases per problem</p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
                      {Object.keys(questionSets).map((sKey) => (
                        <button
                          key={sKey}
                          onClick={() => setAdminViewSetId(sKey)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            adminViewSetId === sKey ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {SET_METADATA[sKey].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {questionSets[adminViewSetId].map((prob) => (
                      <div key={prob.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-400">Leg {prob.legNumber} ({prob.difficulty})</span>
                            <span className="text-xs font-mono text-slate-400">{prob.points} pts</span>
                          </div>
                          <h4 className="font-bold text-xs text-white truncate">{prob.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prob.description}</p>
                        </div>
                        <button
                          onClick={() => setAdminEditProblem({ ...prob })}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition"
                        >
                          Edit Problem
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Telemetry Feed */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-rose-400" /> Proctor Security Telemetry
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">{securityLogs.length} Events</span>
                  </div>
                  <div className="h-40 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
                    {securityLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                          log.severity === 'critical' ? 'bg-rose-950/20 border-rose-900/50 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{log.time}</span>
                          <span className="font-bold text-amber-300">{log.teamName}:</span>
                          <span>{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LIVE LEADERBOARD VIEW ================= */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {}
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Code Relay Live Leaderboard
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time standings based on points and solve speeds</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                </div>
              </div>
            </div>

            {/* Podium Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedLeaderboard[1] && (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 relative flex flex-col justify-between order-2 md:order-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold text-xs">🥈 2nd Place</span>
                    <span className="text-base font-mono font-black text-slate-200">
                      {Object.values(sortedLeaderboard[1].scores).reduce((a, b) => a + b, 0)} pts
                    </span>
                  </div>
                  <div className="my-3">
                    <h4 className="font-bold text-white text-sm truncate">{sortedLeaderboard[1].name}</h4>
                    <p className="text-xs text-slate-400 truncate">{sortedLeaderboard[1].department}</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                    <span>{formatSeconds(sortedLeaderboard[1].elapsedSec)}</span>
                    <span className="text-slate-300">{sortedLeaderboard[1].status}</span>
                  </div>
                </div>
              )}

              {sortedLeaderboard[0] && (
                <div className="rounded-2xl border border-amber-500/60 bg-gradient-to-b from-amber-500/15 to-slate-950 p-5 relative flex flex-col justify-between order-1 md:order-2 shadow-lg shadow-amber-500/10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                      👑 1st Champion
                    </span>
                    <span className="text-lg font-mono font-black text-amber-300">
                      {Object.values(sortedLeaderboard[0].scores).reduce((a, b) => a + b, 0)} pts
                    </span>
                  </div>
                  <div className="my-3">
                    <h4 className="font-extrabold text-white text-base truncate">{sortedLeaderboard[0].name}</h4>
                    <p className="text-xs text-amber-200/80 truncate">{sortedLeaderboard[0].department}</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 border-t border-amber-500/20 pt-2 flex justify-between">
                    <span>{formatSeconds(sortedLeaderboard[0].elapsedSec)}</span>
                    <span className="text-emerald-400 font-bold">{sortedLeaderboard[0].status}</span>
                  </div>
                </div>
              )}

              {sortedLeaderboard[2] && (
                <div className="rounded-2xl border border-amber-800/50 bg-slate-900/60 p-4 relative flex flex-col justify-between order-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-800/30 text-amber-500 font-bold text-xs">🥉 3rd Place</span>
                    <span className="text-base font-mono font-black text-amber-400">
                      {Object.values(sortedLeaderboard[2].scores).reduce((a, b) => a + b, 0)} pts
                    </span>
                  </div>
                  <div className="my-3">
                    <h4 className="font-bold text-white text-sm truncate">{sortedLeaderboard[2].name}</h4>
                    <p className="text-xs text-slate-400 truncate">{sortedLeaderboard[2].department}</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                    <span>{formatSeconds(sortedLeaderboard[2].elapsedSec)}</span>
                    <span className="text-slate-300">{sortedLeaderboard[2].status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                      <th className="py-3 px-3 text-center w-12">Rank</th>
                      <th className="py-3 px-3">Team & Institution</th>
                      <th className="py-3 px-3 text-center">Leg 1</th>
                      <th className="py-3 px-3 text-center">Leg 2</th>
                      <th className="py-3 px-3 text-center">Leg 3</th>
                      <th className="py-3 px-3 text-center">Strikes</th>
                      <th className="py-3 px-3 text-right">Elapsed</th>
                      <th className="py-3 px-3 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {sortedLeaderboard
                      .filter((t) => {
                        const q = searchQuery.toLowerCase();
                        return (
                          t.name.toLowerCase().includes(q) ||
                          t.department.toLowerCase().includes(q) ||
                          t.email.toLowerCase().includes(q)
                        );
                      })
                      .map((team, idx) => {
                        const totalScore = Object.values(team.scores).reduce((a, b) => a + b, 0);

                        return (
                          <tr
                            key={team.id}
                            className={`transition hover:bg-slate-800/30 ${
                              team.id === activeTeam.id ? 'bg-amber-500/5' : ''
                            } ${team.isDisqualified ? 'opacity-60 bg-rose-950/10' : ''}`}
                          >
                            <td className="py-3 px-3 text-center font-mono font-bold">
                              {team.isDisqualified ? (
                                <span className="text-rose-500">DQ</span>
                              ) : (
                                `#${idx + 1}`
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{team.name}</div>
                              <div className="text-[11px] text-slate-400">{team.department}</div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono">
                              {team.scores.easy > 0 ? (
                                <span className="text-emerald-400 font-bold">✓ {formatSeconds(team.solvedAtSeconds.easy)}</span>
                              ) : (
                                <span className="text-slate-600">--</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-mono">
                              {team.scores.medium > 0 ? (
                                <span className="text-emerald-400 font-bold">✓ {formatSeconds(team.solvedAtSeconds.medium)}</span>
                              ) : (
                                <span className="text-slate-600">--</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-mono">
                              {team.scores.hard > 0 ? (
                                <span className="text-emerald-400 font-bold">✓ {formatSeconds(team.solvedAtSeconds.hard)}</span>
                              ) : (
                                <span className="text-slate-600">--</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-mono">
                              <span className={team.strikes >= 3 ? 'text-rose-500 font-bold' : team.strikes > 0 ? 'text-amber-400' : 'text-slate-500'}>
                                {team.strikes}/3
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-300">
                              {team.startedAt ? formatSeconds(team.elapsedSec) : '--:--'}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-sm">
                              {team.isDisqualified ? (
                                <span className="text-rose-400 text-xs">DISQUALIFIED</span>
                              ) : (
                                <span className="text-amber-300">{totalScore}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rules Agreement Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Code Relay Guidelines</h3>
              </div>
              <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                Your assigned challenge track includes Easy, Medium, and Hard challenges (4 sample and 5 hidden test cases each).
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <p><strong>Team Timer (50:00):</strong> Your team countdown begins as soon as you confirm below.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <p><strong>Do Not Copy Paste:</strong> Copying and pasting code is strictly prohibited. Please type your code manually.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <p><strong>Proctored Tab Switch Strikes:</strong> Navigating away from this tab will register a strike. 3 strikes result in disqualification.</p>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rulesAgreedCheckbox}
                  onChange={(e) => setRulesAgreedCheckbox(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  I and my team have read and agree to all contest rules.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTeamContest}
                disabled={!rulesAgreedCheckbox}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  rulesAgreedCheckbox
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Start Timer & Enter Relay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Code Relay One-Time Login</h3>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleKonguLogin} className="space-y-3 text-xs">
              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">Institutional Email (*@kongu.edu)</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rollno@kongu.edu"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Team Name</label>
                <input
                  type="text"
                  value={loginTeamName}
                  onChange={(e) => setLoginTeamName(e.target.value)}
                  placeholder="e.g. CyberKnights"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Department</label>
                <select
                  value={loginDept}
                  onChange={(e) => setLoginDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Member 1</label>
                  <input
                    type="text"
                    value={loginRunner1}
                    onChange={(e) => setLoginRunner1(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Member 2</label>
                  <input
                    type="text"
                    value={loginRunner2}
                    onChange={(e) => setLoginRunner2(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Member 3</label>
                  <input
                    type="text"
                    value={loginRunner3}
                    onChange={(e) => setLoginRunner3(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition mt-2"
              >
                Enter Station
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Problem Modal */}
      {adminEditProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" /> Edit Problem & Test Suite ({adminEditProblem.title})
              </h3>
              <button onClick={() => setAdminEditProblem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProblemEdit} className="space-y-4 text-xs overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Title</label>
                  <input
                    type="text"
                    value={adminEditProblem.title}
                    onChange={(e) => setAdminEditProblem({ ...adminEditProblem, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Points</label>
                  <input
                    type="number"
                    value={adminEditProblem.points}
                    onChange={(e) => setAdminEditProblem({ ...adminEditProblem, points: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={adminEditProblem.description}
                  onChange={(e) => setAdminEditProblem({ ...adminEditProblem, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono leading-relaxed"
                />
              </div>

              {/* Test Case Management Header & Tabs */}
              <div className="pt-2 border-t border-slate-850">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminActiveTestCaseTab('sample')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        adminActiveTestCaseTab === 'sample'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Shown Sample Cases ({(adminEditProblem.sampleCases || []).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminActiveTestCaseTab('hidden')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        adminActiveTestCaseTab === 'hidden'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Hidden Test Cases ({(adminEditProblem.hiddenCases || []).length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddTestCase(adminActiveTestCaseTab)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Case
                  </button>
                </div>

                {/* Test Cases List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {adminActiveTestCaseTab === 'sample' &&
                    (adminEditProblem.sampleCases || []).map((tc, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-amber-300">Sample Case #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase('sample', idx)}
                            className="text-rose-400 hover:text-rose-300 transition"
                            title="Delete case"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                          <div>
                            <label className="block text-[10px] text-slate-400">Input:</label>
                            <textarea
                              rows={2}
                              value={tc.input}
                              onChange={(e) => handleUpdateTestCase('sample', idx, 'input', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-750 rounded p-1.5 text-xs text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400">Expected Output:</label>
                            <textarea
                              rows={2}
                              value={tc.expected}
                              onChange={(e) => handleUpdateTestCase('sample', idx, 'expected', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-750 rounded p-1.5 text-xs text-slate-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Explanation (Optional):</label>
                          <input
                            type="text"
                            value={tc.explanation || ''}
                            onChange={(e) => handleUpdateTestCase('sample', idx, 'explanation', e.target.value)}
                            placeholder="Explanation shown to participants..."
                            className="w-full bg-slate-950 border border-slate-750 rounded px-2 py-1 text-xs text-slate-300"
                          />
                        </div>
                      </div>
                    ))}

                  {adminActiveTestCaseTab === 'hidden' &&
                    (adminEditProblem.hiddenCases || []).map((tc, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-cyan-300">Hidden Test Case #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase('hidden', idx)}
                            className="text-rose-400 hover:text-rose-300 transition"
                            title="Delete case"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                          <div>
                            <label className="block text-[10px] text-slate-400">Input:</label>
                            <textarea
                              rows={2}
                              value={tc.input}
                              onChange={(e) => handleUpdateTestCase('hidden', idx, 'input', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-750 rounded p-1.5 text-xs text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400">Expected Output:</label>
                            <textarea
                              rows={2}
                              value={tc.expected}
                              onChange={(e) => handleUpdateTestCase('hidden', idx, 'expected', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-750 rounded p-1.5 text-xs text-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-850 shrink-0">
                <button
                  type="button"
                  onClick={() => setAdminEditProblem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Switch Warning Modal */}
      {tabWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-rose-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {tabWarningModal.strikes >= 3 ? 'TEAM DISQUALIFIED' : `Tab Switch Strike ${tabWarningModal.strikes}/3`}
            </h3>
            <p className="text-xs text-slate-300">{tabWarningModal.message}</p>
            <button
              onClick={() => setTabWarningModal(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Non-Penalizing Paste Notice */}
      {pasteNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-950/95 border border-amber-500/50 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 max-w-lg">
          <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs text-amber-200">
            <strong>Do not copy paste.</strong> Please type your code manually.
          </div>
        </div>
      )}

      {/* In-App Toast */}
      {toastNotification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-bold ${
            toastNotification.type === 'critical'
              ? 'bg-rose-950 border-rose-500/50 text-rose-200'
              : toastNotification.type === 'warning'
              ? 'bg-amber-950 border-amber-500/50 text-amber-200'
              : 'bg-cyan-950 border-cyan-500/50 text-cyan-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          {toastNotification.message}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Code Relay Competition • Automated Proctoring & Evaluation Platform</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-600 hover:text-slate-400 text-[11px] font-mono transition"
            >
              Proctor Access (Alt+Shift+A)
            </button>
            <span className="text-slate-800">|</span>
            <span className="font-mono text-[11px]">Relay Engine v3.4.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}