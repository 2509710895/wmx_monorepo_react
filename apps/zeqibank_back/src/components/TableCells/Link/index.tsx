interface LinkCellProps {
    value: string;
    record?: any;
    onClick: () => void;
}

const LinkCell: React.FC<LinkCellProps> = ({ value, onClick }) => {
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

export default LinkCell;

// const render=(text: any, record: any) => {
//     color = state > 0.5 ? 'red' : 'green';
//     return (
//         <LinkCell
//             value={text}
//             record={record}
//             onClick={() => {
//                 reduxDrawer.show({
//                     open: true,
//                     id: (record.id as number),
//                 });
//             }
//         }
//     )
// }