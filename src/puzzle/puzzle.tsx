import { useState, useMemo, useRef } from 'react'
import './puzzle.css'

interface Piece {
    id: string;
    x: number;
    y: number;
    pieceNumber: number;
}

const Puzzle: React.FC = () => {
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [splitNumber, setSplitNumber] = useState<number>(3);
    const draggedPiece = useRef<Piece | null>(null);

    const generatePieces = () => {
        const newPieces: Piece[] = [];
        for (let j = 0; j < splitNumber; j++) {
            for (let i = 0; i < splitNumber; i++) {
                newPieces.push({ id: `piece-${i}-${j}`, x: i % splitNumber * 100, y: j % splitNumber * 100, pieceNumber: j * splitNumber + i });
            }
        }
        for (let i = newPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
        }
        //setPieces(newPieces);
        return newPieces;
    };

    const newPieces = useMemo(() => {
        return generatePieces();
    }, [bgImage, splitNumber]);

    const [pieces, setPieces] = useState<Piece[]>(newPieces);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBgImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const incress = () => {
        if (splitNumber >= 10) {
            alert("Maximum number of pieces is 10");
            return;
        }
        setSplitNumber(splitNumber + 1);
    }

    const decress = () => {
        if (splitNumber <= 3) {
            alert("Minimum number of pieces is 3");
            return;
        }
        setSplitNumber(splitNumber - 1);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const pieceId = target.getAttribute('id');
        draggedPiece.current = pieces.find(piece => piece.id === pieceId) || null;
        console.log(`Dragging piece start: ${pieceId}`);
    }

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const pieceId = target.getAttribute('id');
        console.log(`Dragging piece end: ${pieceId}`);
        setTimeout(() => {
            checkIsWin();
        }, 1);
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
        const pieceId = target.getAttribute('id');
        console.log(`Dragging over piece: ${pieceId}`);
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
        const pieceId = target.getAttribute('id');
        console.log(`Dropped on piece: ${pieceId}`);
        if (!draggedPiece.current) return;
        if (draggedPiece.current.id === pieceId) return;
        const draggedPieceIndex : number = pieces.findIndex(piece => piece.id === draggedPiece.current?.id);
        const targetPieceIndex : number = pieces.findIndex(piece => piece.id === pieceId);
        const newPieces = [...pieces];
        [newPieces[draggedPieceIndex], newPieces[targetPieceIndex]] = [newPieces[targetPieceIndex], newPieces[draggedPieceIndex]];
        setPieces(newPieces);
    }

    const checkIsWin = () => {
        if(pieces.length === 0) return;
        if(!bgImage) return;
        let isWin : boolean = true;
        console.log(pieces);
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].pieceNumber !== i) {
                isWin = false;
                break;
            }
        }
        if(isWin) {
            alert("You win!");
            return;
        }
    }

return (
    <>
        <h2>Image Puzzle Game</h2>
        <section className="split_container">
            <input type="number" value={splitNumber} className="pices_numner" readOnly /> *
            <input type="number" value={splitNumber} className="pices_numner" readOnly />
            <button className="btn_number" onClick={incress}>+</button>
            <button className="btn_number" onClick={decress}>-</button>
        </section>
        <section className='uploder_container'>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
        </section>
        <section className='puzzle-container' style={{ gridTemplateColumns: `repeat(${splitNumber}, 100px)`, gridTemplateRows: `repeat(${splitNumber}, 100px)` }}>
            {pieces.map((piece) => (
                <div key={piece.id} id={piece.id} className="puzzle_piece" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={handleDrop} style={{ backgroundImage: `url(${bgImage})`, backgroundSize: `${100 * splitNumber}px`, backgroundPosition: `${-piece.x}px ${-piece.y}px` }} ></div>
            ))}
        </section>
    </>
);
}

export default Puzzle;