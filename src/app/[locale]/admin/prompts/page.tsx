import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { promptStore } from '@/stores/promptStore';
import PaginationTable from '@/components/PaginationTable';

'use client';


const PromptManagementPage: React.FC = observer(() => {
    useEffect(() => {
        promptStore.fetchPrompts();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Prompt Management</h1>
            <PaginationTable
                data={promptStore.prompts}
                total={promptStore.total}
                loading={promptStore.loading}
                page={promptStore.page}
                pageSize={promptStore.pageSize}
                onPageChange={promptStore.setPage}
                onPageSizeChange={promptStore.setPageSize}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Prompt', dataIndex: 'text', key: 'text' },
                    { title: 'Actions', key: 'actions', render: (record: any) => (
                        <button
                            className="text-red-500"
                            onClick={() => promptStore.deletePrompt(record.id)}
                        >
                            Delete
                        </button>
                    )},
                ]}
            />
        </div>
    );
});

export default PromptManagementPage;