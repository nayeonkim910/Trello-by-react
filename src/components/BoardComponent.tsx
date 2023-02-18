import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, toDoState } from '../atoms';
import DraggableCard from './DraggableCard';


const Box = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 20px;
  height: 100%;
  min-height: 200px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  
`
const Title =styled.h1`
    text-align: center;
    font-weight: bold;
    padding-bottom: 20px;
    font-size: 20px;
`
interface ContentProps{
    draggingFromThisWith:boolean;
    isDraggingOver:boolean;
}
const Content=styled.div<ContentProps>`
    background-color: ${(props)=>props.isDraggingOver?'#c780fa83':props.draggingFromThisWith?'#ecf2ffa0':'#F6F7C1'};
    flex-grow: 1;
    padding-top: 2px;
    border-radius: 7px;
    transition: background-color 300ms ease-in-out;
`
const FormBox= styled.form`
    width: 100%;
    input{
        width: 100%;
        border: none;
        padding: 10px;
        border-radius: 5px;
        margin: 3px 0px;
    }

`
interface IBoardProps{
    toDos:ITodo[];
    boardId:string;
}
interface IForm {
    text:string;
}
export default function BoardComponent({toDos,boardId}:IBoardProps) {
   
    const {register,setValue, handleSubmit } = useForm<IForm>();
    const setToDoArr = useSetRecoilState(toDoState);
    const onValid = ({text}:IForm)=> {
        const newTodo = {id:Date.now(),text};
        setToDoArr(prevArr=>{
            return{
                ...prevArr,
                [boardId]:[...prevArr[boardId],newTodo],
            };
        })
        setValue("text",'');
        }

    return (
        <Box>
                <Title>{boardId}</Title>
                <FormBox onSubmit={handleSubmit(onValid)}>
                    <input {...register('text',{required:true})} type="text" placeholder='Add..🖍' />
                </FormBox>
            <Droppable droppableId={boardId}>
                {(magic, snapshot)=>(
                    <Content 
                    isDraggingOver={snapshot.isDraggingOver}
                    draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                    {...magic.droppableProps} ref={magic.innerRef}>
                    {toDos.map((todo,index)=>(
                      <DraggableCard key={todo.id} todoId={todo.id} todoText={todo.text} index={index} boardId={boardId} />
                    ))}
                    {magic.placeholder}
                     </Content>
              )}
            </Droppable>
        </Box>
    );
}

