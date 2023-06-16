interface ImageCellProps {
    value: string;
    record: any;
    onClick: () => void;
}

const ImageCell: React.FC<ImageCellProps> = ({ value, onClick }) => {
    return (
        <a
            style={{
                color: '#1890ff',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >{value}</a>
    );
};

export default ImageCell;