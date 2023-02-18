import {DragDropContext,  DropResult} from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import BoardComponent from './components/BoardComponent';
import {FcAddDatabase} from 'react-icons/fc'
import { useForm } from 'react-hook-form';
import {useState} from 'react';
import {GrClose} from 'react-icons/gr';

const Container =styled.div`
  background-image: linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%);
  position: relative;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow-y: scroll;
  overflow-x: scroll;
  ::-webkit-scrollbar{
  display: none;
  }
  
`

const Boards = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  justify-content: center;
  width: 100%;
  padding: 10px;
  position: relative;
`
const Title =styled.h1`
  background-color: #00000021;
  width: 100%;
  font-size: 60px;
  color: wheat;
  padding: 15px;
  height: 90px;
  position: fixed;
  z-index: 3;
`
const Btn=styled.button`
  border: none;
  z-index: 6;
  font-size: 55px;
  background-color: transparent;
  transition: transform 200ms ease-in-out;
  &:hover{
    transform: scale(1.2);
    cursor: pointer;
  }
`
const Popup =styled.form`
  width: 400px;
  height: 200px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: #f4cff8;
  border: 1px solid back;
  position: absolute;
  padding: 10px;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${Btn}{
    font-size: 30px;
    position: absolute;
    top: 10px;
    right: 7px;
    &:hover{
      transform: scale(1.2);
     }
  }
`
const PopupBox =styled.div<{isPopup:boolean}>`
  width: 100%;
  height: 100vh;
  background-color: #e7e6b162;
  position: absolute;
  z-index: 3;
  display: ${(props)=>props.isPopup?'block':'none'};
`
const PopupTitle =styled.h1`
  text-align: center;
  padding: 10px;
  width: 70%;
  font-size: 22px;
  background-color: #d5bcec;
`
const PopupInput =styled.input`
  width: 90%;
  border: none;
  padding: 20px;
`
interface ICreateBoardForm {
  title:string;
}
export default function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [isPopup,setIsPopup] =useState<boolean>(false);
    const {register,setValue, handleSubmit } = useForm<ICreateBoardForm>();
   const onValid =({title}:ICreateBoardForm)=>{
      setToDos(prevArr=>{
        return{
          ...prevArr,
          [title]:[],
        }
      })
      setValue('title','');
    }
  const onDragEnd =(infoObj:DropResult)=>{
    const {destination,source,draggableId} = infoObj;
    if(!destination) return;

    if(destination?.droppableId === source.droppableId){
      setToDos(prevArr=>{
        const copiedSourceArr = [...prevArr[source.droppableId]];
        const targetObj =copiedSourceArr[source.index];
        copiedSourceArr.splice(source.index,1);
        copiedSourceArr.splice(destination.index,0,targetObj );
        return {
          ...prevArr,
          [source.droppableId]:copiedSourceArr,
        };
      });
    }
    else{
       setToDos(prevArr=>{
         const copiedSourceArr = [...prevArr[source.droppableId]];
         const copiedDestiArr=[...prevArr[destination?.droppableId]];
         const targetObj = copiedSourceArr[source.index];
         copiedSourceArr.splice(source.index,1);
         copiedDestiArr.splice(destination.index,0,targetObj);
        return{
          ...prevArr,
          [source.droppableId]:copiedSourceArr,
          [destination?.droppableId]:copiedDestiArr,
        }})}
  };
  const handlePopup=()=> setIsPopup(prev=>!prev);
  
  
  return (
    <>
      <Title>
        <Btn onClick={handlePopup}><FcAddDatabase/></Btn>
      </Title>
      <DragDropContext onDragEnd={onDragEnd}>
          <Container> 
            <PopupBox isPopup={isPopup} >
              <Popup onSubmit={handleSubmit(onValid)}>
                  <Btn onClick={handlePopup}><GrClose/></Btn>
                  <PopupTitle >보드를 추가하세요 🖍</PopupTitle>
                  <PopupInput placeholder='Enter' {...register('title',{required:true})}></PopupInput> 
              </Popup>
              </PopupBox>
            <Boards>
              {Object.keys(toDos).map((boardId)=>(
                <BoardComponent boardId={boardId} key={boardId} toDos={toDos[boardId]}/>
              ))}
            </Boards>
          </Container>
      </DragDropContext>
    </>
  )
}

