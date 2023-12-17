type Props = {
    date: number,
    selected: boolean,
    onClick: () => void
}

const DateItem: React.FC<Props> = ({ date, selected, onClick }) => {
    return (
        <span
            style={{ backgroundColor: selected ? "blue" : "initial" }}
            onClick={onClick}
        >
            {` ${date} `}
        </span>
    );
};
export default DateItem;