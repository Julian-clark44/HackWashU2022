from random import choice

# citation for maze generation: https://www.youtube.com/watch?v=Ez7U6jU0q5k

cols, rows = 8, 8

class Cell:
    def __init__(self, x, y):
        self.x, self.y = x, y
        self.walls = {'top': True, 'right': True, 'bottom': True, 'left': True}
        self.visited = False
        self.thickness = 4
        self.isGoalSquare = False; 

    def setGoalSquare(self): 
        self.isGoalSquare = True

    def check_cell(self, x, y):
        find_index = lambda x, y: x + y * cols
        if x < 0 or x > cols - 1 or y < 0 or y > rows - 1:
            return False
        return self.grid_cells[find_index(x, y)]

    def check_neighbors(self, grid_cells):
        self.grid_cells = grid_cells
        neighbors = []
        top = self.check_cell(self.x, self.y - 1)
        right = self.check_cell(self.x + 1, self.y)
        bottom = self.check_cell(self.x, self.y + 1)
        left = self.check_cell(self.x - 1, self.y)
        if top and not top.visited:
            neighbors.append(top)
        if right and not right.visited:
            neighbors.append(right)
        if bottom and not bottom.visited:
            neighbors.append(bottom)
        if left and not left.visited:
            neighbors.append(left)
        return choice(neighbors) if neighbors else False
    
    def toString(self):
        string = "x: {}, y: {}, top: {}".format(self.x, self.y, self.walls["top"])
        return string


def remove_walls(current, next):
    dx = current.x - next.x
    if dx == 1:
        current.walls['left'] = False
        next.walls['right'] = False
    elif dx == -1:
        current.walls['right'] = False
        next.walls['left'] = False
    dy = current.y - next.y
    if dy == 1:
        current.walls['top'] = False
        next.walls['bottom'] = False
    elif dy == -1:
        current.walls['bottom'] = False
        next.walls['top'] = False

def generate_maze():
    grid_cells = [Cell(col, row) for row in range(rows) for col in range(cols)]
    current_cell = grid_cells[0]
    array = []
    break_count = 1

    while break_count != len(grid_cells):
        current_cell.visited = True
        next_cell = current_cell.check_neighbors(grid_cells)
        if next_cell:
            next_cell.visited = True
            break_count += 1
            array.append(current_cell)
            remove_walls(current_cell, next_cell)
            current_cell = next_cell
        elif array:
            current_cell = array.pop()
    return grid_cells

class Edge: 
    def __init__(self, x1, y1, x2, y2): 
        self.x1, self.y1, self.x2, self.y2 = x1, y1, x2, y2
    
    def equals(self, otherEdge): 
        return self.x1 == otherEdge.x1 and self.y1 == otherEdge.y1 and self.x2 == otherEdge.x2 and self.y2 == otherEdge.y2

    def toString(self): 
        return "(x1, y1): ({}, {})   (x2, y2): ({}, {})".format(self.x1, self.y1, self.x2, self.y2)

def generateEdges(maze): 
    trueEdges = []

    def arrayContains(edgeArray, edgeToAdd): 
        for e in edgeArray: 
            if e.equals(edgeToAdd): 
                return True
        return False

    for cell in maze:
        if cell.walls["top"]: 
            edgeToAdd = Edge(cell.x, cell.y, cell.x+1, cell.y)
            if not arrayContains(trueEdges, edgeToAdd): 
                trueEdges.append(edgeToAdd)

        if cell.walls["bottom"]: 
            edgeToAdd = Edge(cell.x, cell.y+1, cell.x+1, cell.y+1)
            if not arrayContains(trueEdges, edgeToAdd): 
                trueEdges.append(edgeToAdd)
        
        if cell.walls["left"]: 
            edgeToAdd = Edge(cell.x, cell.y, cell.x, cell.y+1)
            if not arrayContains(trueEdges, edgeToAdd): 
                trueEdges.append(edgeToAdd)

        if cell.walls["right"]: 
            edgeToAdd = Edge(cell.x+1, cell.y, cell.x+1, cell.y+1)
            if not arrayContains(trueEdges, edgeToAdd): 
                trueEdges.append(edgeToAdd)
    return trueEdges 
