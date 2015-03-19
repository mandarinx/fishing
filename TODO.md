# Idea for proc.gen of islands
Cellular automata doesn't generate very interesting islands. They're blobby and round, and looks generated. A problem with generating the island based on an algorithm is that the proc.gen algorithm goes straight for the visuals. It makes it difficult to easily add elements like a pier, a city and roads. There's no underlying data structure to the island.

This approach tries to make more visually interesting islands and allow for easier placement of cities and other elements by first generating a data structure.

## High level description of algorithm

1. Generate a grid of points. Connect each point with its closest neighbours.
2. Randomly offset each point in x and y, but not so much that two points can overlap or switch sides.
3. Remove a random set of points. Clean up neighbour connections so that points with only one neighbour don't have an undefined element in its neighbours array.
4. Give each point a random weight.
    4a. The number of neighbours can regulate the weight. Less neighbours means less weight. Could be useful if squares overlap too much.
5. Create a square for each point, using weight as the dimension of the square.

If we render the data now, we get an island constructed of multiple squares.

Alternative to try to make the island more interesting:
1. Rotate each, or some squares by a little bit
2. Use Bresenham's line algorithm to rasterize lines between all points of all squares
3. Use a fill algorithm to fill all squares from the center and outwards

A second alternative is to make the squares irregular. The length of the rectangle could be affected by the distance between the point and its neighbours.

A third alternative is to randomly scatter smaller squares around the edges of the island to break it up. I think a square-ish island could be interesting. It seems different.

A fourth alternative could be to play with height levels. Maybe the weight dictactes the height, too. I don't want to make it too complex though.

Using the data we have created, we can easily pick spots for placing cities, mountains, forests and whatnot. By picking a point and using the weight to select a random offset, we can safely and quickly pick coordinates that we know are on the island. With cellular automata, or any other similar algoritm (perhaps excluding Perlin Noise), we would have to brute force select all grass tiles, and use the results to try to find a coordinate in the middle of the island.
