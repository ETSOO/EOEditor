/**
 * EOEditor special characters
 * https://www.toptal.com/designers/htmlarrows/symbols/
 * HTML table to Google excel, format the data with SUBSTITUTE, JOINTEXT
 */
export const EOEditorCharacters = {
    arrows: [
        0x2190, 0x2191, 0x2192, 0x2193, 0x2194, 0x2195, 0x2196, 0x2197, 0x2198,
        0x2199, 0x219a, 0x219b, 0x219c, 0x219d, 0x219e, 0x219f, 0x21a0, 0x21a1,
        0x21a2, 0x21a3, 0x21a4, 0x21a5, 0x21a6, 0x21a7, 0x21a8, 0x21a9, 0x21aa,
        0x21ab, 0x21ac, 0x21ad, 0x21ae, 0x21af, 0x21b0, 0x21b1, 0x21b2, 0x21b3,
        0x21b4, 0x21b5, 0x21b6, 0x21b7, 0x21b8, 0x21b9, 0x21ba, 0x21bb, 0x21bc,
        0x21bd, 0x21be, 0x21bf, 0x21c0, 0x21c1, 0x21c2, 0x21c3, 0x21c4, 0x21c5,
        0x21c6, 0x21c7, 0x21c8, 0x21c9, 0x21ca, 0x21cb, 0x21cc, 0x21cd, 0x21ce,
        0x21cf, 0x21d0, 0x21d1, 0x21d2, 0x21d3, 0x21d4, 0x21d5, 0x21d6, 0x21d7,
        0x21d8, 0x21d9, 0x21da, 0x21db, 0x21dc, 0x21dd, 0x21de, 0x21df, 0x21e0,
        0x21e1, 0x21e2, 0x21e3, 0x21e4, 0x21e5, 0x21e5, 0x21e6, 0x21e7, 0x21e8,
        0x21e9, 0x21ea, 0x21eb, 0x21ec, 0x21ed, 0x21ee, 0x21ef, 0x21f0, 0x21f1,
        0x21f2, 0x21f3, 0x21f4, 0x21f5, 0x21f6, 0x21f7, 0x21f8, 0x21f9, 0x21fa,
        0x21fb, 0x21fc, 0x21fd, 0x21fe, 0x21ff, 0x27f0, 0x27f1, 0x27f2, 0x27f3,
        0x27f4, 0x27f5, 0x27f6, 0x27f7, 0x27f8, 0x27f9, 0x27fa, 0x27fb, 0x27fc,
        0x27fd, 0x27fe, 0x27ff, 0x2900, 0x2901, 0x2902, 0x2903, 0x2904, 0x2905,
        0x2906, 0x2907, 0x2908, 0x2909, 0x290a, 0x290b, 0x290c, 0x290d, 0x290e,
        0x290f, 0x2910, 0x2911, 0x2912, 0x2913, 0x2914, 0x2915, 0x2916, 0x2917,
        0x2918, 0x2919, 0x291a, 0x291b, 0x291c, 0x291d, 0x291e, 0x291f, 0x2920,
        0x2921, 0x2922, 0x2923, 0x2924, 0x2925, 0x2926, 0x2927, 0x2928, 0x2929,
        0x292a, 0x292b, 0x292c, 0x292d, 0x292e, 0x292f, 0x2930, 0x2931, 0x2932,
        0x2933, 0x2934, 0x2935, 0x2936, 0x2937, 0x2938, 0x2939, 0x293a, 0x293b,
        0x293c, 0x293d, 0x293e, 0x293f, 0x2940, 0x2941, 0x2942, 0x2943, 0x2944,
        0x2945, 0x2946, 0x2947, 0x2948, 0x2949, 0x294a, 0x294b, 0x294c, 0x294d,
        0x294e, 0x294f, 0x2950, 0x2951, 0x2952, 0x2953, 0x2954, 0x2955, 0x2956,
        0x2957, 0x2958, 0x2959, 0x295a, 0x295b, 0x295c, 0x295d, 0x295e, 0x295f,
        0x2960, 0x2961, 0x2962, 0x2963, 0x2964, 0x2965, 0x2966, 0x2967, 0x2968,
        0x2969, 0x296a, 0x296b, 0x296c, 0x296d, 0x296e, 0x296f, 0x2970, 0x2971,
        0x2972, 0x2973, 0x2974, 0x2975, 0x2976, 0x2977, 0x2978, 0x2979, 0x297a,
        0x297b, 0x297c, 0x297d, 0x297e, 0x297f, 0x2794, 0x2798, 0x2799, 0x279a,
        0x279b, 0x279c, 0x279d, 0x279e, 0x279f, 0x27a0, 0x27a1, 0x27a2, 0x27a3,
        0x27a4, 0x27a5, 0x27a6, 0x27a7, 0x27a8, 0x27a9, 0x27aa, 0x27ab, 0x27ac,
        0x27ad, 0x27ae, 0x27af, 0x27b1, 0x27b2, 0x27b3, 0x27b4, 0x27b5, 0x27b6,
        0x27b7, 0x27b8, 0x27b9, 0x27ba, 0x27bb, 0x27bc, 0x27bd, 0x27be
    ],
    currency: [
        0x24, 0xa2, 0xa3, 0x20ac, 0xa5, 0x20b9, 0x20bd, 0x5143, 0xa4, 0x20a0,
        0x20a1, 0x20a2, 0x20a3, 0x20a4, 0x20a5, 0x20a6, 0x20a7, 0x20a8, 0x20a9,
        0x20aa, 0x20ab, 0x20ad, 0x20ae, 0x20af, 0x20b0, 0x20b1, 0x20b2, 0x20b3,
        0x20b4, 0x20b5, 0x20b6, 0x20b8, 0x20ba, 0x20bc, 0x09f2, 0x09f3, 0x0af1,
        0x0bf9, 0x0e3f, 0x17db, 0x3350, 0x5186, 0x5706, 0x570e, 0x5713, 0x571c,
        0xc6d0, 0xfdfc, 0xff04, 0xffe0, 0xffe1, 0xffe5, 0xffe6
    ],
    math: [
        0x2260, 0xb1, 0xac, 0x3c, 0x3e, 0x22dc, 0x22dd, 0xb0, 0xb9, 0xb2, 0xb3,
        0x192, 0x25, 0x89, 0x2031, 0x2200, 0x2201, 0x2202, 0x2203, 0x2204,
        0x2205, 0x2206, 0x2207, 0x2208, 0x2209, 0x220a, 0x220b, 0x220c, 0x220d,
        0x220e, 0x220f, 0x2210, 0x2211, 0x2213, 0x2214, 0x2215, 0x2216, 0x2217,
        0x2218, 0x2219, 0x221a, 0x221b, 0x221c, 0x221d, 0x221e, 0x221f, 0x2220,
        0x2221, 0x2222, 0x2223, 0x2224, 0x2225, 0x2226, 0x2227, 0x2228, 0x2229,
        0x222a, 0x222b, 0x222c, 0x222d, 0x222e, 0x222f, 0x2230, 0x2231, 0x2232,
        0x2233, 0x2234, 0x2235, 0x2236, 0x2237, 0x2238, 0x2239, 0x223a, 0x223b,
        0x223c, 0x223d, 0x223e, 0x223f, 0x2240, 0x2241, 0x2242, 0x2243, 0x2244,
        0x2245, 0x2246, 0x2247, 0x2248, 0x2249, 0x224a, 0x224b, 0x224c, 0x224d,
        0x224e, 0x224f, 0x2250, 0x2251, 0x2252, 0x2253, 0x2254, 0x2255, 0x2256,
        0x2257, 0x2258, 0x2259, 0x225a, 0x225b, 0x225c, 0x225d, 0x225e, 0x225f,
        0x2261, 0x2262, 0x2263, 0x2264, 0x2265, 0x2266, 0x2267, 0x2268, 0x2269,
        0x226a, 0x226b, 0x226c, 0x226d, 0x226e, 0x226f, 0x2270, 0x2271, 0x2272,
        0x2273, 0x2274, 0x2275, 0x2276, 0x2277, 0x2278, 0x2279, 0x227a, 0x227b,
        0x227c, 0x227d, 0x227e, 0x227f, 0x2280, 0x2281, 0x2282, 0x2283, 0x2284,
        0x2285, 0x2286, 0x2287, 0x2288, 0x2289, 0x228a, 0x228b, 0x228c, 0x228d,
        0x228e, 0x228f, 0x2290, 0x2291, 0x2292, 0x2293, 0x2294, 0x2295, 0x2296,
        0x2297, 0x2298, 0x2299, 0x229a, 0x229b, 0x229c, 0x229d, 0x229e, 0x229f,
        0x22a0, 0x22a1, 0x22a2, 0x22a3, 0x22a4, 0x22a5, 0x22a6, 0x22a7, 0x22a8,
        0x22a9, 0x22aa, 0x22ab, 0x22ac, 0x22ad, 0x22ae, 0x22af, 0x22b0, 0x22b1,
        0x22b2, 0x22b3, 0x22b4, 0x22b5, 0x22b6, 0x22b7, 0x22b8, 0x22b9, 0x22ba,
        0x22bb, 0x22bc, 0x22bd, 0x22be, 0x22bf, 0x22c0, 0x22c1, 0x22c2, 0x22c3,
        0x22c4, 0x22c5, 0x22c6, 0x22c7, 0x22c8, 0x22c9, 0x22ca, 0x22cb, 0x22cc,
        0x22cd, 0x22ce, 0x22cf, 0x22d0, 0x22d1, 0x22d2, 0x22d3, 0x22d4, 0x22d5,
        0x22d6, 0x22d7, 0x22d8, 0x22d9, 0x22da, 0x22db, 0x22de, 0x22df, 0x22e0,
        0x22e1, 0x22e2, 0x22e3, 0x22e4, 0x22e5, 0x22e6, 0x22e7, 0x22e8, 0x22e9,
        0x22ea, 0x22eb, 0x22ec, 0x22ed, 0x22ee, 0x22ef, 0x22f0, 0x22f1, 0x22f2,
        0x22f3, 0x22f4, 0x22f5, 0x22f6, 0x22f7, 0x22f8, 0x22f9, 0x22fa, 0x22fb,
        0x22fc, 0x22fd, 0x22fe, 0x22ff, 0x2090, 0x2091, 0x2092, 0x2093, 0x2094
    ],
    numbers: [
        0xbc, 0xbd, 0xbe, 0x2150, 0x2151, 0x2152, 0x2153, 0x2154, 0x2155,
        0x2156, 0x2157, 0x2158, 0x2159, 0x215a, 0x215b, 0x215c, 0x215d, 0x215e,
        0x215f, 0x2160, 0x2161, 0x2162, 0x2163, 0x2164, 0x2165, 0x2166, 0x2167,
        0x2168, 0x2169, 0x216a, 0x216b, 0x216c, 0x216d, 0x216e, 0x216f, 0x2170,
        0x2171, 0x2172, 0x2173, 0x2174, 0x2175, 0x2176, 0x2177, 0x2178, 0x2179,
        0x217a, 0x217b, 0x217c, 0x217d, 0x217e, 0x217f, 0x2180, 0x2181, 0x2182,
        0x2183, 0x2184, 0x2185, 0x2186, 0x2189
    ],
    punctuation: [
        0x21, 0x22, 0x23, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2c, 0x2e, 0x2f,
        0x3a, 0x3b, 0x3f, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60, 0x7b, 0x7c,
        0x7d, 0x7e, 0xa0, 0xa1, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xab, 0xac, 0xad,
        0xae, 0xaf, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xbb,
        0xbf, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2016, 0x2017,
        0x2018, 0x2019, 0x201a, 0x201b, 0x201c, 0x201d, 0x201e, 0x201f, 0x2020,
        0x2021, 0x2022, 0x2023, 0x2024, 0x2025, 0x2026, 0x2027, 0x2030, 0x2031,
        0x2032, 0x2033, 0x2034, 0x2035, 0x2036, 0x2037, 0x2038, 0x2039, 0x203a,
        0x203b, 0x203c, 0x203d, 0x203e, 0x203f, 0x2040, 0x2041, 0x2042, 0x2043,
        0x2044, 0x2045, 0x2046, 0x2047, 0x2048, 0x2049, 0x204a, 0x204b, 0x204c,
        0x204d, 0x204e, 0x204f, 0x2050, 0x2051, 0x2052, 0x2053, 0x2054, 0x2055,
        0x2056, 0x2057, 0x2058, 0x2059, 0x205a, 0x205b, 0x205c, 0x205d, 0x205e,
        0x2122
    ],
    symbols: [
        0xa9, 0xae, 0x2122, 0x40, 0xb6, 0xa7, 0x2100, 0x2101, 0x2102, 0x2103,
        0x2104, 0x2105, 0x2106, 0x2107, 0x2108, 0x2109, 0x210a, 0x210b, 0x210c,
        0x210d, 0x210e, 0x210f, 0x2110, 0x2111, 0x2112, 0x2113, 0x2114, 0x2115,
        0x2116, 0x2117, 0x2118, 0x2119, 0x211a, 0x211b, 0x211c, 0x211d, 0x211e,
        0x211f, 0x2120, 0x2121, 0x2123, 0x2124, 0x2125, 0x2126, 0x2127, 0x2128,
        0x2129, 0x212a, 0x212b, 0x212c, 0x212d, 0x212e, 0x212f, 0x2130, 0x2131,
        0x2132, 0x2133, 0x2134, 0x2135, 0x2136, 0x2137, 0x2138, 0x2139, 0x213a,
        0x213b, 0x213c, 0x213d, 0x213e, 0x213f, 0x2140, 0x2141, 0x2142, 0x2143,
        0x2144, 0x2145, 0x2146, 0x2147, 0x2148, 0x2149, 0x214a, 0x214b, 0x214d,
        0x214e, 0x2600, 0x2601, 0x2602, 0x2603, 0x2604, 0x2605, 0x2606, 0x2607,
        0x2608, 0x2609, 0x260a, 0x260b, 0x260c, 0x260d, 0x260e, 0x260f, 0x2610,
        0x2611, 0x2612, 0x2613, 0x2616, 0x2617, 0x2618, 0x2619, 0x261a, 0x261b,
        0x261c, 0x261d, 0x261e, 0x261f, 0x2620, 0x2621, 0x2622, 0x2623, 0x2624,
        0x2625, 0x2626, 0x2627, 0x2628, 0x2629, 0x262a, 0x262b, 0x262c, 0x262d,
        0x262e, 0x262f, 0x2630, 0x2631, 0x2632, 0x2633, 0x2634, 0x2635, 0x2636,
        0x2637, 0x2638, 0x2639, 0x263a, 0x263b, 0x263c, 0x263d, 0x263e, 0x263f,
        0x2640, 0x2641, 0x2642, 0x2643, 0x2644, 0x2645, 0x2646, 0x2647, 0x2654,
        0x2655, 0x2656, 0x2657, 0x2658, 0x2659, 0x265a, 0x265b, 0x265c, 0x265d,
        0x265e, 0x265f, 0x2660, 0x2661, 0x2662, 0x2663, 0x2664, 0x2665, 0x2666,
        0x2667, 0x2668, 0x2669, 0x266a, 0x266b, 0x266c, 0x266d, 0x266e, 0x266f,
        0x2670, 0x2671, 0x2672, 0x2673, 0x2674, 0x2675, 0x2676, 0x2677, 0x2678,
        0x2679, 0x267a, 0x267b, 0x267c, 0x267d, 0x267e, 0x2680, 0x2681, 0x2682,
        0x2683, 0x2684, 0x2685, 0x2686, 0x2687, 0x2688, 0x2689, 0x268a, 0x268b,
        0x268c, 0x268d, 0x268e, 0x268f, 0x2690, 0x2691, 0x2692, 0x2694, 0x2695,
        0x2696, 0x2697, 0x2698, 0x2699, 0x269a, 0x269b, 0x269c, 0x269d, 0x269e,
        0x269f, 0x26a0, 0x26a2, 0x26a3, 0x26a4, 0x26a5, 0x26a6, 0x26a7, 0x26a8,
        0x26a9, 0x26ac, 0x26ad, 0x26ae, 0x26af, 0x26b0, 0x26b1, 0x26b2, 0x26be,
        0x26e2, 0x2701, 0x2702, 0x2703, 0x2704, 0x2706, 0x2707, 0x2708, 0x2709,
        0x270c, 0x270d, 0x270e, 0x270f, 0x2710, 0x2711, 0x2712, 0x2713, 0x2714,
        0x2715, 0x2716, 0x2717, 0x2718, 0x2719, 0x271a, 0x271b, 0x271c, 0x271d,
        0x271e, 0x271f, 0x2720, 0x2721, 0x2722, 0x2723, 0x2724, 0x2725, 0x2726,
        0x2727, 0x2729, 0x272a, 0x272b, 0x272c, 0x272d, 0x272e, 0x272f, 0x2730,
        0x2731, 0x2732, 0x2733, 0x2734, 0x2735, 0x2736, 0x2737, 0x2738, 0x2739,
        0x273a, 0x273b, 0x273c, 0x273d, 0x273e, 0x273f, 0x2740, 0x2741, 0x2742,
        0x2743, 0x2744, 0x2745, 0x2746, 0x2747, 0x2748, 0x2749, 0x274a, 0x274b,
        0x274d, 0x274f, 0x2750, 0x2751, 0x2752, 0x2756, 0x2758, 0x2759, 0x275a,
        0x275b, 0x275c, 0x275d, 0x275e, 0x2761, 0x2762, 0x2763, 0x2764, 0x2765,
        0x2766, 0x2767, 0x2768, 0x2769, 0x276a, 0x276b, 0x276c, 0x276d, 0x276e,
        0x276f, 0x2770, 0x2771, 0x2772, 0x2773, 0x2774, 0x2775, 0x2776, 0x2777,
        0x2778, 0x2779, 0x277a, 0x277b, 0x277c, 0x277d, 0x277e, 0x277f, 0x2780,
        0x2781, 0x2782, 0x2783, 0x2784, 0x2785, 0x2786, 0x2787, 0x2788, 0x2789,
        0x278a, 0x278b, 0x278c, 0x278d, 0x278e, 0x278f, 0x2790, 0x2791, 0x2792,
        0x2793
    ]
};

/**
 * EOEditor character type
 */
export type EOEditorCharacterType = keyof typeof EOEditorCharacters;
