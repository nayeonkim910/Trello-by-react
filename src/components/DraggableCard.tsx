import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {GrClose} from 'react-icons/gr';
import { useSetRecoilState } from 'recoil';
import { toDoState } from '../atoms';
const Option =styled.button`
    font-size: 20px;
    padding: 0;
    border: none;
    background-color: transparent;
    &:hover{
        transform: scale(1.2);
    }
`
const Card = styled.div<{isDragging:boolean}>`
  background-color: ${(props)=>props.isDragging?'#efcfe3':'#ebe4f2cc'};
  transition: background-color 300ms ease-in-out;
  padding: 8px 15px;
  align-items: center;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 2px, rgba(0, 0, 0, 0.1) 0px 5px 10px -3px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset;
`
interface IDraggableCardProps{
    todoId:number,
    todoText:string,
    index:number,
    boardId:string,
}

function DraggableCard({todoId,todoText, index,boardId}:IDraggableCardProps) {
        const setToDosArr = useSetRecoilState(toDoState);
        const handleClick=()=>{
            setToDosArr((prevArr)=>{
            const copiedArr = [...prevArr[boardId]];
            copiedArr.splice(index,1);
                return{
                    ...prevArr,
                    [boardId]:copiedArr,
                }
            });
        }
    return (
        <Draggable  draggableId={todoId+''} index={index}>
            {(magic,snapshot)=>(
                <Card isDragging={snapshot.isDragging} {...magic.draggableProps}{...magic.dragHandleProps} ref={magic.innerRef}>
                <span>{todoText}</span>
                <Option onClick={handleClick}><GrClose/></Option>
                </Card>)
            }
        </Draggable>
         );
}
export default React.memo(DraggableCard);

