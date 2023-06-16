interface TextCellProps {
    value: string;
    record?: any;
}

const TextCell: React.FC<TextCellProps> = ({ value }) => {
    return (
        <span>{value}</span>
    );
};

export default TextCell;