__author__ = "Linus Dannull"

 
import math
import pygame
from random import choice

RES = WIDTH, HEIGHT = 1202, 902
TILE = 100
cols, rows = WIDTH // TILE, HEIGHT // TILE

pygame.init()
sc = pygame.display.set
clock = pygame.time.Clock()

while True: 
    sc.fill(pygame.Color("darkslategray"))
    for event in pygame.event.get(): 
        if event.type == pygame.QUIT: 
            exit()
    pygame.display.flip()
    clock.tick(30)
