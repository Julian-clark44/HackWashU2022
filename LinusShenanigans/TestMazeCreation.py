from GenerateMaze import *

maze = generate_maze()
maze[len(maze)-20].setGoalSquare()
pygame.init()

RES = 802, 602
game_surface = pygame.Surface(RES)

sc = pygame.display.set_mode(RES)

clock = pygame.time.Clock()

pygame.display.update()

open = True
while open: 
    sc.fill(pygame.Color('black'))
    for event in pygame.event.get(): 
        if event.type == pygame.QUIT: 
            open = False

    for cell in maze: 
        cell.draw(sc)


    pygame.display.flip()
    clock.tick(30)
pygame.quit()
quit()