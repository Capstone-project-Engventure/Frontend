'use client';
import React, { useEffect } from 'react';
// import { observer } from 'mobx-react-lite';
import { usePromptStore } from '@/lib/store/promptStore';
import PaginationTable from '@/app/[locale]/components/table/PaginationTable';
import AdvancedDataTable from '../../components/table/AdvancedDataTable';




const PromptManagementPage: React.FC = (() => {
    const promptStore = usePromptStore();

    useEffect(() => {
        promptStore.fetchPrompts();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Prompt Management</h1>
            {/* <PaginationTable
                
            /> */}
            <AdvancedDataTable
                fields={promptStore.fields}
                service={promptStore.service}
                page={promptStore.page}
                onPageChange={promptStore.setPage}
                keyField="id"
                customObjects={promptStore.customObjects}
                customTotalPages={promptStore.customTotalPages}
                modalFields={promptStore.modalFields}
                modalTitle="Edit Prompt"
                linkBase="/admin/prompts"
                breadcrumbs={promptStore.breadcrumbs}
                hasImport={promptStore.hasImport}
                hasCustomFetch={promptStore.hasCustomFetch}
                onAdd={promptStore.addPrompt}
                onUpdate={promptStore.updatePrompt}
                onDelete={promptStore.deletePrompt}
                onEdit={promptStore.editPrompt}
                // onCreate={promptStore.createPrompt}
                onSuccess={promptStore.onSuccess}
            />
        </div>
    );
});

export default PromptManagementPage;