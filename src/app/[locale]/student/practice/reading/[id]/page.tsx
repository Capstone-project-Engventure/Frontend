import ReadingWithQuestions from '@/app/[locale]/components/ReadingWithQuestions ';

const HomePage = () => {
    const readingData = {
        title: "Lorem Ipsum",
        passage: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc",
        questions: [
            {
                question: "If you are going to use?",
                options: ["of passages of Lorem", "The Extremes of Good and Evil", "Latin words", "Lorem Ipsum"],
            },
            {
                question: "It uses a dictionary?",
                options: ["below for those interested", "Cicero are also reproduced", "All the Lorem Ipsum generators", "or randomised words"],
            },
        ],
    };

    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <ReadingWithQuestions {...readingData} />
        </main>
    );
};

export default HomePage;
