"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list.item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";



interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);                                          // Copia de la lista original
  const [removed] = result.splice(startIndex, 1);                           // Se elimina en la copia el elemento en la posición starIndex
  result.splice(endIndex, 0, removed);                                      // Se añade el elemento en la posición endIndex

  return result;                                                            // Se devuelve la lista con las posiciones modificadas
};

const ListContainer = ({ data, boardId }: ListContainerProps) => {

  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data)
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;           // result(evento de draggable) proporciona destino, origen y tipo de objeto movido

    if (!destination) {                                     // si no hay un destino la función no hace nada
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&     // Si el elemento se solto en la misma posición tampoco se hace nada
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {                                  // Si se mueve una lista
      const items = reorder(                                // Se llama a la función reorder
        orderedData,                                        // con la lista original
        source.index,                                       // el origen
        destination.index,                                  // el destino 
      ).map((item, index) => ({ ...item, order: index }));  // Se asignan nuevos ordenes (order:index) a los elementos reordenados

      setOrderedData(items);                                // Se actualiza el estado  que refleja el resultado de la reordenación
      executeUpdateListOrder({ items, boardId });           // Se llama a la action para que se actualize en bd
    }

    // User moves a card
    if (type === "card") {                                  // Si se mueve una tarjeta
      let newOrderedData = [...orderedData];                // Copia de la lista ordenada

      // Source and destination list
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);     // Buscamos en la copia el origen 
      const destList = newOrderedData.find(list => list.id === destination.droppableId);  // y el destino en la lista

      if (!sourceList || !destList) {
        return;
      }

    //   Check if cards exists on the sourceList
      if (!sourceList.cards) {                            // Se verifica si las props "cards" existen en ambas listas, origen y destino
        sourceList.cards = [];
      }

    // Check if cards exists on the destList
       if (!destList.cards) {
         destList.cards = [];
       }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) { // Si el movimiento es en la misma lista
        const reorderedCards = reorder(                     // se llama a la fn reorder según los índices de origen y destino de las cards  
          sourceList.cards,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, idx) => {             // Se asignan nuevos ordenes a las tarjetas reordenadas  
          card.order = idx;
        });

        sourceList.cards = reorderedCards;                  // Se asigna a la lista original la prop cards con las nuevas cards reordenadas

        setOrderedData(newOrderedData);                     // Modificar sourceList implica hacerlo con newOrderedData
        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards,
        });
      } else {
        // User moves the card to another list
      
        const [movedCard] = sourceList.cards.splice(source.index, 1);   // Eliminación de la tarjeta de la lista de origen en la posición source.index

        movedCard.listId = destination.droppableId;                     // Asignación del nuevo listId a la tarjeta movida
        
        destList.cards.splice(destination.index, 0, movedCard);         // Se agrega a la lista de destino(destList.cards) la tarjeta movida en la posición destination.index

        sourceList.cards.forEach((card, idx) => {                       // Se actualiza el orden para cada tarjeta en la lista de origen.
          card.order = idx;
        });
       
        destList.cards.forEach((card, idx) => {                         // Se actualiza el orden para cada tarjeta en la lista de destino.
          card.order = idx;
        });

        setOrderedData(newOrderedData); // Se actualiza el estado con la nueva referencia completa de newOrderedData, que ahora refleja los cambios realizados.
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        });
      }
    }
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided) => (
          <ol 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ListContainer