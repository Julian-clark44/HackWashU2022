import pygame
from random import choice, randrange

class Cell: 
    def __init__(self, x, y, sc, TILE, cols, rows): 
        self.x, self.y = x, y # represents which cell were in, not the pixel coordinates
        self.walls = {"top": True, "right": True, "bottom": True, "left": True}
        self.sc = sc # surface to draw on
        self.TILE = TILE # determines sizing of tiles
        self.cols = cols
        self.rows = rows
    
    def drawCurrentCell(self): 
        xCord, yCord, TILE, sc = self.x * self.TILE, self.y * self.TILE, self.TILE, self.sc
        pygame.draw.rect(sc, pygame.Color("black"), (xCord + 2, yCord + 2, TILE - 2, TILE -2))


    def draw(self): 
        xCord, yCord, TILE, sc = self.x * self.TILE, self.y * self.TILE, self.TILE, self.sc

        if self.walls["top"]: 
            pygame.draw.line(sc, pygame.Color("black"), (xCord, yCord), (xCord + TILE, yCord), 2)
        if self.walls["right"]: 
            pygame.draw.line(sc, pygame.Color("black"), (xCord + TILE, yCord), (xCord + TILE, yCord + TILE), 2)
        if self.walls["bottom"]: 
            pygame.draw.line(sc, pygame.Color("black"), (xCord + TILE, yCord + TILE), (xCord, yCord + TILE), 2)
        if self.walls["left"]: 
            pygame.draw.line(sc, pygame.Color("black"), (xCord, yCord + TILE), (xCord, yCord), 2)
    
    def checkCell(self, x, y): 
        find_index = lambda x, y: x + y + self.cols
        if(x < 0 or x > self.cols - 1 or y < 0 or y > self.rows-1):    
            return False
        return self.grid_cells[find_index(x, y)]

    # def check_neighbors(self, grid_cells):
    #     self.grid_cells = grid_cells
    #     neighbors = []
    #     top = self.check_cell(self.x, self.y - 1)
    #     right = self.check_cell(self.x + 1, self.y)
    #     bottom = self.check_cell(self.x, self.y + 1)
    #     left = self.check_cell(self.x - 1, self.y)
    #     if top and not top.visited:
    #         neighbors.append(top)
    #     if right and not right.visited:
    #         neighbors.append(right)
    #     if bottom and not bottom.visited:
    #         neighbors.append(bottom)
    #     if left and not left.visited:
    #         neighbors.append(left)
    #     return choice(neighbors) if neighbors else False

class Game: 
    def __init__(self, WIDTH, HEIGHT, TILE): 
        self.WIDTH = WIDTH # game window width
        self.HEIGHT = HEIGHT # game window height
        self.TILE = TILE

    def generateMaze(self): 
        pygame.init()
        open = True

        RES = self.WIDTH, self.HEIGHT 
        cols, rows = self.WIDTH // self.TILE, self.HEIGHT // self.TILE

        sc = pygame.display.set_mode(RES)
        clock = pygame.time.Clock()

        pygame.display.update()
        
        grid_cells = [Cell(col, row, sc, self.TILE, cols, rows) for row in range(rows) for col in range(cols)]
        current_cell = grid_cells[0]
        stack = []

        # Open game window and begin updating positions
        while open: 
            sc.fill(pygame.Color('darkslategray'))
            for event in pygame.event.get(): 
                if event.type == pygame.QUIT: 
                    open = False

            for cell in grid_cells: 
                cell.draw()
                
            current_cell.drawCurrentCell()
            
            # current_cell = grid_cells[cellPosition]
            # cellPosition += 1


            pygame.display.flip()
            clock.tick(30)
        pygame.quit()
        quit()

if __name__ == "__main__": 
    theGame = Game(802, 602, 50) # (width, height, tileSize)
    theGame.generateMaze()