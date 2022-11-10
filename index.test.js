import {snake} from './script.js'

test('Tail initializes correctly', ()=>{
    expect(snake().tail).toEqual([[2,4],[1,4]])
})

test('validMoves correctly reports available moves', ()=>{
    const test = snake()
    expect(test.validMoves()).toEqual([[4,4],[3,5],[3,3]])
})

test('advance correctly returns new snake', ()=>{
    const test = snake()
    const newsnake = test.advance()
    expect(newsnake.tail).toEqual([[3,4],[2,4]])
})

test('turn correctly redirects snake', ()=>{
    const test = snake()
    test.turn(1)
    const newsnake = test.advance()
    expect(newsnake.head).toEqual([3,5])
})

test('isDead returns false for live snakes', ()=>{
    const test = snake()
    const deadSnake = test.advance().advance().advance().advance().advance().advance().advance()
    expect(deadSnake.isDead()).toEqual(true)
})