import { StarIcon } from '@heroicons/react/24/solid';

export function Star ({ filled, half, onClick, color }) {
    return (
        <span onClick={onClick}>
            {filled ? <StarIcon width={25} color={color}/> : half ? 
            <StarIcon width={25} color={color}/> : <StarIcon width={25} color={color}/>}
        </span>
    );
};

export default Star;