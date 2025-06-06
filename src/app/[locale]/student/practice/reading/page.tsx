"use client";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { log } from "console";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";



const ReadingExercises = () => {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const exerciseService = new ExerciseService();
  const pathname = usePathname()
  const locale = pathname.split("/")[1];
  useEffect(() => {
    const fetchExercises = async () => {
      // exerciseService
      //   .getAll({ filters: { skill: "reading" } })
      //   .then((response) => {
      //     if (response.success) {
      //       console.log("Fetched exercises:", response.data);
      //       setExercises(response.data);
      //     } else {
      //       console.error("Failed to fetch exercises:", response.data);
      //     }
      //   });
      setExercises([
        {
          "id": "4fd319a7-580d-4dd8-b74a-c23396e53030",
          "topic": {
            "id": "9c372af8-662f-40ad-8b2a-4c38e9180733",
            "title": "Verb Tense",
            "description": "",
            "category": "other",
            "order": 0
          },
          "topic_id": "9c372af8-662f-40ad-8b2a-4c38e9180733",
          "title": "Grammar test - multiple choice test 60",
          "level": "A2",
          "type": "practice",
          "description": "Bài test tổng hợp về các thì của động từ",
          "course_id": null,
          "exercises": []
        },
        {
          "id": "b2263ce0-6f7c-4085-aba1-b07b475b22b8",
          "topic": null,
          "topic_id": null,
          "title": "Pronunciation Practice /æ/",
          "level": "A1",
          "type": "lesson",
          "description": "Luyện tập phát âm âm /æ/",
          "course_id": null,
          "exercises": [
            {
              "id": "5dc14e55-80f0-4ed6-aa5e-f8fbbb455dbf",
              "name": "Say the word: man",
              "question": "man",
              "system_answer": null,
              "type": {
                "id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
                "name": "Single word pronunciation",
                "description": "Luyện phát âm với 1 từ"
              },
              "type_id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
              "level": "A1",
              "skill": "pronunciation",
              "image": null,
              "lesson": "b2263ce0-6f7c-4085-aba1-b07b475b22b8",
              "generated_by": "system",
              "description": "Say the word: man",
              "options": null,
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/b2263ce0-6f7c-4085-aba1-b07b475b22b8/Say%20the%20word%3A%20man?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=b29121e01fd34036633bd5ea31f53d04fb9d4dc499c8ba4defccd8f6ee44322003de634477c89225fffea2f3b4ebb3b2b86854fac12e4c2a24dccf689d7b76b3599359fe3f885dfbdfa57cd9f62da415ebd6bb388997598f690aae32134ec927a26e043106670b6e9aea249a2f0673166c891affc7cfa4779492644424751343562ef672d4c19e0cf6030f337859a07541de9e75c268ffa39ebff34dd8095048132125feff810991fd61666919902539ca61c5ea7786a0dcef7e4ea9634a4eb0cd85b50ab4e814f157a4fd3503f4317efae0c3cc25856884a1bcb1a7802efa7d328546488ee159b8522224b04e03c3187878ea2bc6f7cea0b8376b8c59d2fa76",
              "audio_file_url": "exercises/audio/b2263ce0-6f7c-4085-aba1-b07b475b22b8/Say the word: man"
            },
            {
              "id": "d138bc79-8b37-43f1-8449-44f107fda545",
              "name": "Say the word: map",
              "question": "map",
              "system_answer": null,
              "type": {
                "id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
                "name": "Single word pronunciation",
                "description": "Luyện phát âm với 1 từ"
              },
              "type_id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
              "level": "A1",
              "skill": "pronunciation",
              "image": null,
              "lesson": "b2263ce0-6f7c-4085-aba1-b07b475b22b8",
              "generated_by": "system",
              "description": "Say the word: map",
              "options": null,
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/b2263ce0-6f7c-4085-aba1-b07b475b22b8/Say%20the%20word%3A%20map?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=06a8a5a9d01a86ba192eb6d0c766965b06762b049a5269753b4f308555100f9807724f4cc7b18edd3142d1a2758f7e34534713b9848938479a9fafe0dbc97d37f4f80dcaff5c8a6df1e180aec88bd6ce05731a2e6fd284417938be95ef4a2997bb93b4f6f72b9c560982754a74084e4ce67f97e9bef61d21ae6d0146b67ec2e5cc8c4640af979e6369065c7c6f3d84401969a2d041939685bc7ab47bce03aefbf9de9a7106d2698dc97fcc08d9c7c8864a3645df047f4abef4b81e16eff1057b017793553e843819d66bed689e2f56e1cba709df14cbf24a44982b53957f43d60cb6645c7cd054247ce11bbfe08c7960bac166ea326fbd6a744f97c1230aa8d0",
              "audio_file_url": "exercises/audio/b2263ce0-6f7c-4085-aba1-b07b475b22b8/Say the word: map"
            },
            {
              "id": "e62fb634-500e-4c57-b9f1-606402876918",
              "name": null,
              "question": "cat",
              "system_answer": "cat",
              "type": {
                "id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
                "name": "Single word pronunciation",
                "description": "Luyện phát âm với 1 từ"
              },
              "type_id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
              "level": "A1",
              "skill": "pronunciation",
              "image": null,
              "lesson": "b2263ce0-6f7c-4085-aba1-b07b475b22b8",
              "generated_by": "system",
              "description": "Say the word: cat",
              "options": null,
              "audio_file": "https://storage.googleapis.com/None/uploads/audio_file/e62fb634-500e-4c57-b9f1-606402876918_audio_file.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=6b02bac1464a473bf11a4b0d6f01ab80b5ff7ced7d9a2fd7927997acd6d8207d99a323ebe200716e400dd49adb0299ccf9e124625d3dd02af0c7d108ee91b965072cec474e72dc01d1b510eaa0de3fc6255b4ee25ada07e9a6fbc40670f96cbaf5a0c865bebdf87d57fc6b8710648a19046d37dd975cde1cfdeaf027d076703c9d933d26cbaace08bdc8c5d550d538867e26575acf78ebaf13aaa3daacbc3c7027a2ce2a95779d1c8deb8e97d5a4782acaca37f03a8158398e9cf8e46666a2d946e1449536403cef9da37a9f007f7fa252ffdaae5efa86de400d95e242795c4cf62f15cf8880b36f0b8c9ee69439e54f858be9df83d1a26f999e1123e7abbb97",
              "audio_file_url": "uploads/audio_file/e62fb634-500e-4c57-b9f1-606402876918_audio_file.mp3"
            }
          ]
        },
        {
          "id": "1155688c-52c5-45a9-bbba-4d990d987b6c",
          "topic": {
            "id": "3f62bc88-2486-4f6d-a95c-50f84048064c",
            "title": "Phonics: /z/ vs /s/",
            "description": "Luyện phát âm phân biệt âm /z/ và /s/",
            "category": "pronunciation",
            "order": 0
          },
          "topic_id": "3f62bc88-2486-4f6d-a95c-50f84048064c",
          "title": "Pronunciation Quiz 1",
          "level": "A1",
          "type": "lesson",
          "description": "Phonic A1",
          "course_id": null,
          "exercises": [
            {
              "id": "48f121bc-7559-4e86-8d41-89fa04deaeed",
              "name": null,
              "question": "zip",
              "system_answer": "zip",
              "type": {
                "id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
                "name": "Single word pronunciation",
                "description": "Luyện phát âm với 1 từ"
              },
              "type_id": "12a3a5d8-578c-411f-92c2-2b1a5db76b1e",
              "level": "A1",
              "skill": "pronunciation",
              "image": null,
              "lesson": "1155688c-52c5-45a9-bbba-4d990d987b6c",
              "generated_by": "system",
              "description": "Say the word: zip",
              "options": null,
              "audio_file": null,
              "audio_file_url": ""
            }
          ]
        },
        {
          "id": "4a6862b1-a751-4517-a556-ef6b4711cfc3",
          "topic": {
            "id": "25a1df93-104f-4f88-a508-54f7e9554a8a",
            "title": "Present Continuous",
            "description": "Thì hiện tại tiếp diễn",
            "category": "grammar",
            "order": 0
          },
          "topic_id": "25a1df93-104f-4f88-a508-54f7e9554a8a",
          "title": "Present continuous practice quiz",
          "level": "A1",
          "type": "lesson",
          "description": "",
          "course_id": null,
          "exercises": []
        },
        {
          "id": "39bed3cb-9973-4575-b354-22c70efbbb7f",
          "topic": {
            "id": "d8f918fa-5d44-48e0-ae22-a99d1b1bd458",
            "title": "Present Simple",
            "description": "Thì hiện tại đơn",
            "category": "grammar",
            "order": 0
          },
          "topic_id": "d8f918fa-5d44-48e0-ae22-a99d1b1bd458",
          "title": "Present simple quizzes",
          "level": "A1",
          "type": "practice",
          "description": "Grammar quizzes for practice",
          "course_id": null,
          "exercises": [
            {
              "id": "af782666-6e42-42a5-b9b2-6427ca554960",
              "name": "Simple present tense",
              "question": "3. My brother always ______ his homework before dinner.",
              "system_answer": "does",
              "type": null,
              "type_id": null,
              "level": "A2",
              "skill": "grammar",
              "image": null,
              "lesson": "39bed3cb-9973-4575-b354-22c70efbbb7f",
              "generated_by": "",
              "description": "Choose the correct form of the verb.",
              "options": [
                {
                  "key": "A",
                  "option": "do"
                },
                {
                  "key": "B",
                  "option": "does"
                },
                {
                  "key": "C",
                  "option": "doing"
                }
              ],
              "audio_file": null,
              "audio_file_url": ""
            },
            {
              "id": "ffadccd2-63d2-4145-bff2-66a3cd7d8381",
              "name": "Simple present tense",
              "question": "2. They ______ in a small village near the mountains.",
              "system_answer": "live",
              "type": null,
              "type_id": null,
              "level": "A2",
              "skill": "grammar",
              "image": null,
              "lesson": "39bed3cb-9973-4575-b354-22c70efbbb7f",
              "generated_by": "",
              "description": "Choose the correct form of the verb.",
              "options": [
                {
                  "key": "A",
                  "option": "lives"
                },
                {
                  "key": "B",
                  "option": "live"
                },
                {
                  "key": "C",
                  "option": "living"
                }
              ],
              "audio_file": null,
              "audio_file_url": ""
            },
            {
              "id": "4e47c8fb-7c6d-4d28-864b-b83b03ff622f",
              "name": "Simple present tense",
              "question": "1. She ______ coffee every morning before work.",
              "system_answer": "drinks",
              "type": null,
              "type_id": null,
              "level": "A2",
              "skill": "grammar",
              "image": null,
              "lesson": "39bed3cb-9973-4575-b354-22c70efbbb7f",
              "generated_by": "",
              "description": "Choose the correct form of the verb.",
              "options": [
                {
                  "key": "A",
                  "option": "drink"
                },
                {
                  "key": "B",
                  "option": "drinks"
                },
                {
                  "key": "C",
                  "option": "drunk"
                }
              ],
              "audio_file": null,
              "audio_file_url": ""
            }
          ]
        },
        {
          "id": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
          "topic": {
            "id": "93aa9d0f-46dc-4bb2-a33d-0e63121c6bc4",
            "title": "Conversation Phrases",
            "description": "Các cụm từ trong hội thoại",
            "category": "other",
            "order": 3
          },
          "topic_id": "93aa9d0f-46dc-4bb2-a33d-0e63121c6bc4",
          "title": "Listening Quiz 2",
          "level": "A1",
          "type": "lesson",
          "description": "This online quiz tests listening comprehension with conversational phrases.",
          "course_id": null,
          "exercises": [
            {
              "id": "032d9688-87b7-4ce2-ba58-d6fcb1b55fb0",
              "name": "listening-quiz-1-9",
              "question": "Do you mind if I take this and call you back?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Sure. No problem"
                },
                {
                  "key": "B",
                  "option": "Sure. I'd be glad to"
                },
                {
                  "key": "C",
                  "option": "Sure. Just a minute"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/9.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=cb73e78398f62c61b7a5678a8263491adb61aa443b01517f49f291686eb45f2dd79c20a837e29281fef05b6c373c708f5827656dedba626489ccc2d9194a202b3cfcaca6410f345f80d80ef73a6581201c5fa5d042401d6564a5d55af68eed72f50efdccacf64002aa3d6dcaa35558350f541b9370035d91b0486334b0b8ed587ddf6d98fa53458d8e31cfe386cff0f794577eca160ca01ada5dd817196505902e2d4a4b62825d4638e4eb5585b4e4d9813795b692e3d93c6061f5742b60a771fdcf9c1c93c4758bfed560b5110fce9cf900c0727e679845ed3c5f12af081af1e17e121a1182a172af0fa2a9c8a6288b7cb96048b7d8f844cfc5ebd6c87b9196",
              "audio_file_url": "exercises/audio/9.mp3"
            },
            {
              "id": "40986f20-ed71-4eda-b528-6ac683a80613",
              "name": "listening-quiz-1-10",
              "question": "Any idea what time it is in Tokyo now?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Sorry, no way"
                },
                {
                  "key": "B",
                  "option": "Sorry, no idea"
                },
                {
                  "key": "C",
                  "option": "Sorry, no time"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/10.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=a38d9c9c524de99bc459b2e71999c44b51fcb6ab5fc4384feccd0cc20576277b0b329c9e3860cc14e749d2d51ec1803422465192ff2b4eef6445a3250ab2636f57938c378a9d11693ac9e808bee576677dabfa77522b1b31cea4514a9b4f4d31293ec8c2b8f0022920202efc996d40ac3705fed022d45c88c9e0357a4f29f4b3aaccb8646039a0c03bb292df2612e30a7f10da3279423259dacee6ee6d7170563e83e365bab6b2f9fb2923952dfae5be02c45fa6199c33d76a448fdb9f39adb8fc4985c2d98fa58f9202b91fa567a33439ed65693dcf78ec723534875c116a3125422c2eaa5d2a7be3a58a6a8b71adc896faa25e8cd5a46e0df0f80fa39544f2",
              "audio_file_url": "exercises/audio/10.mp3"
            },
            {
              "id": "131a555b-6a52-4b3e-885e-d2ef6a377885",
              "name": "listening-quiz-1-8",
              "question": "If I tell you, promise to keep it to yourself?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "I can't tell"
                },
                {
                  "key": "B",
                  "option": "You never can tell"
                },
                {
                  "key": "C",
                  "option": "Cross my heart"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/8.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=a6c672946c5f4c7bd03845066c7df1b27a2b1bc4c18fdd5d35a39e2bee9807156cd5d752c4c4beb1b43ee6c3ae559871b09763ff1d01a64085662402754b2c846b23a705c56617e6ee6116f3e3c52ca8b9ffe3200a2fa705803793c181d20603334e471f91a9a2ebf3ec2600fa6192aed0bb9caf5959831eb4bd42a627f67192c1f16bd03cefab19fb503a3d9b423e92a3b6681eb76196d834511fc3b63e6bdbe4379fb6d59495b744b3a40bd42fa7fca88dbfa39bd88b2eb1b2c2a3eb517a1dd5f6024cdb63c20bed16250bea768a8f6269f6dfcf9a7f0e3c51d7e6309df9be433beafd680b0d600f059faf0076c20f637e1043cd83196d1d39f382f2676aec",
              "audio_file_url": "exercises/audio/8.mp3"
            },
            {
              "id": "db438991-584b-4499-a4ef-9d90c0a39585",
              "name": "listening-quiz-1-7",
              "question": "Did you get a seat on that flight you wanted?",
              "system_answer": "A",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "No such luck"
                },
                {
                  "key": "B",
                  "option": "No much luck"
                },
                {
                  "key": "C",
                  "option": "Never get lucky"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/7.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=08c3a8e1170e9ce7dc61b5765ee0f369f47624bff3b46934a1cc29d67723a228a045ab0e6617ec3ec5c9ef561d9b88ebc723a803dfbecc0067f884bb0ea026576866e6426cccce92fb56ee65ac41d7a7c18233f4055a9fbeb868bf4f92470d83aff3f73997e9442305c839d5f367fa889ae5059c5869d9c60c78638e9b969424e501ee96228922e56a1560daba19fb838d1e58229d1596291d114457ab910b7c5731000764eb46fceba04f491e7f75dd265ee6fef18e4087fcbc9b2ec6baa04ac5b3a19c0a383385f69667e8a06276444f06c725090dec2f45ca28cdbf7b6d26f1b34b2fdcea4521ba017342a8122ba19ddf5f8feef673428ef258a199caa3b2",
              "audio_file_url": "/audio/listening/quizzes/1abc/7.mp3"
            },
            {
              "id": "2a334ea1-3277-4592-8d72-f6c09b869cf6",
              "name": "listening-quiz-1-6",
              "question": "Would you care for more wine, sir?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Much, sir"
                },
                {
                  "key": "B",
                  "option": "Yes please"
                },
                {
                  "key": "C",
                  "option": "Yes, I care"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/6.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=daa2397445f49a103e6552c9e4bad60bb791e3354cb4d529b967e7e238f9134f8dcc4cfffc863b5197b60ee9b5d28ab35b3c44706653014ffbce48d0e682f754db9666ed42fe72a2cfeea11384b4a0794d1fc600b0ae01cea946be1b515536ce3368c37d259129dfce384abf832199fdc6d7a560e584b564545113901d0de34e8d233d01c40ee71b49a3a811df8cb8ee383352b142a9688473b7b506ac0c94381de438b14fef8c5185c69840f84ac8aafd338464296732e95feabbe29ce976c55eceddb478eea9a16d5bd3821dec6806e9b69b3d6f3680bac161118e8a72bec15b81ecb23c8a462789321412ea86f3382657483c08d406a927fafe90aa09b2f7",
              "audio_file_url": "/audio/listening/quizzes/1abc/6.mp3"
            },
            {
              "id": "a30d689e-5f3f-4099-a30b-30aabfcf8090",
              "name": "listening-quiz-1-5",
              "question": "What are you guys doing on the weekend?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "No way"
                },
                {
                  "key": "B",
                  "option": "Nothing much"
                },
                {
                  "key": "C",
                  "option": "Not that I know of"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/5.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=6a543da36c031756e391f1b76f9a78c1fc17ffc37a82a4771f84eb395c2c1c43c14b851f8353d318a1774d7b4ff52b08b2ba813194f32fdc7e8eaf8d19d6a10b3cadc85b03d12486290fbbc7856d7eba0fb9d76d7a6fc34b7831c5a44f4ac1cb9531b7a63bced1e82b19e404fccdc01515798d5e1eb22461ae04e3135691ae0535c9a51e73a1ddb1e68c8d40d7f3888af43388ac17a400754464bd35d7734c9c06fb6a8d2ec7e6aba919dba1afda782204a494bc19498ac3e4f3aa81fd88dee78f3073905ccfd695adf44adb3b9cfe86070b6ba27c53300bed4a4e01cdd8de0184adf69876952335d1a4508967626c4f4e22364cca1bf3db3060a3af1fb3bca0",
              "audio_file_url": "/audio/listening/quizzes/1abc/5.mp3"
            },
            {
              "id": "3787a43e-a024-46fd-af71-5c7e7fb1fc1e",
              "name": "listening-quiz-1-4",
              "question": "Excuse me. Do you have these shoes in a size ten?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "I'm afraid so"
                },
                {
                  "key": "B",
                  "option": "I'm afraid not"
                },
                {
                  "key": "C",
                  "option": "I'm afraid no"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/4.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=3fba54d112d0066ded4fc27c3ad80a6af85423a67480c6d570a24bd50ee6fe6fe9569c49a3aa01f89ec08ee8caaa5c1c56745b6cf3aab57e44d586d82e7c86bd92f09ceba342927d5c41e873dc4d50ec6975412645c5f500ff53718bd6626c114ed267305925581cf5ee5c8c2b5f10feceafc04febb5080174091aed8ca379b7403f20e40c006245c9914fbe73b03cf74901a0f711f788df8e1734fef9a497723edf0d8641e88916febd38d3eb7482936a49949d20fa4fd4496864b346fa97963c26e1f3877c2b63eeb9b114ceaef64f4a3c61d361e3f9ad89211da4bf0a6441343a43057aad565c1caf4a0ca999ed1ab64c326eda9ad380f5a6bd04fa96655f",
              "audio_file_url": "/audio/listening/quizzes/1abc/4.mp3"
            },
            {
              "id": "8d2b3d75-222d-4b11-a907-90b68957a2dc",
              "name": "listening-quiz-1-3",
              "question": "Is this the one you were looking for?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Yes! That's this!"
                },
                {
                  "key": "B",
                  "option": "Yes! That's it!"
                },
                {
                  "key": "C",
                  "option": "Yes! That's that!"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/3.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=48dde4807e623abc3776bb92f280d3486402f8728ccb12eb618cd027ff15ec6a084311df091a05b626f56c85e76e9a0b49478de9b76aaec732292d60b632e426d7baa59c394fc530558b3aa4b39e3f83ddd2cb35baed6102cd263972d0faf3ac7a19bf9904accd6e3c01263557f9ef913223fe9657335faa701838ae6ff3abcd14b6c141824ec312bc47867c4cced407a4c83e655c900d39ef1168ac7d4499cc862cdc1442aa6d56867aef939197601194634f4d2679ffa11fd5333eebed8562b2089a50ea84187d127bf9a9bb6839621a6a3b50b77cd578b196e65b824c1b5c6e4ce3fa8ed91a548c5c9b4ada88d1d296f7070b92f11ec99f9ea09fd04195e1",
              "audio_file_url": "/audio/listening/quizzes/1abc/3.mp3"
            },
            {
              "id": "8e6fed79-6fbd-4d01-8a5f-0c76d11df98c",
              "name": "listening-quiz-1-2",
              "question": "What do you want for dinner? Thai food or Indian?",
              "system_answer": "B",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Thanks a lot"
                },
                {
                  "key": "B",
                  "option": "Sounds good"
                },
                {
                  "key": "C",
                  "option": "Up to you"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/2.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=1b1304415be3127f0277b43d8e496b9b07868f469f52756b26ba18c188b910812c04f3e05eb9a875e209723154a8ae33d7f096f93c7b4941c30d2df47aeaf9c36bb340b38cce79ff5b373188221b118bb6b084025e0c6d94ba34f57667fd323da5be71edb9192fe01e6b1928b925a509018c4311e8fe6386c6cdd549b7e3e0d6f490ee8f5f49a3dd54906823588515ab1618c834f8de479c4959adafbc21aec0efa6800fb5c3a0fa66388703c83352470435755ef1b2c80904b9457d5591edd1d3082607f167c92ab705d980b94c557231b3d97157329d150cfef6fb06d14ab5185e40d5802a6d2679fe1aec5014cd554b13868b842bc640a3e096b4d665cef0",
              "audio_file_url": "/audio/listening/quizzes/1abc/2.mp3"
            },
            {
              "id": "4b2c7409-a099-4697-bb19-bac143c86180",
              "name": "listening-quiz-1-1",
              "question": "Would you mind holding the door, please?",
              "system_answer": "A",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Not at all"
                },
                {
                  "key": "B",
                  "option": "Not so much"
                },
                {
                  "key": "C",
                  "option": "Not that I know of"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/audio/listening/quizzes/1abc/1.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=8ffbc0a48e888538ace2b856c5be7f1b3c5499fde2aef3a684cd0119f5134e9b00a676067b99f41aaca391f6af7fe66907a470a2fffaf2a09af32700c3304dc365c4cccebf982f79e5d977355bc13fbd63d7b2a4bc2b6ac0de95557aca6e715976b8f145fc2b43619e84c4194df98387bc3b132a95226672057d1d6aa26f64569734dc0a1dbcad1df4e004ad06bfe1ca34ecc4c91528ef98612dd83803b539584b26b516f0c196cf0a618b5bdf326c47fa826f50e35ce6cfd46a046a588d7957bda8ebd43c1f5a982b951b90139450cfd07a68cb0cf9c6b7d03648eb97c8e7f9da326300bc7f5cd73dcc15f8c51f582df38326f16a2bd7d736777f33f1beb7d0",
              "audio_file_url": "/audio/listening/quizzes/1abc/1.mp3"
            },
            {
              "id": "2e90a70d-09a5-429f-9bc0-8f856bcb4286",
              "name": "listening-quiz-1-2",
              "question": "What do you want for dinner? Thai food or Indian?",
              "system_answer": "C",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response",
              "options": [
                {
                  "key": "A",
                  "option": "Thanks a lot"
                },
                {
                  "key": "B",
                  "option": "Sounds good"
                },
                {
                  "key": "C",
                  "option": "Up to you"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/2.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=9157bb18095b5a848633c48f9e042472f69c19a2b4184242678e12e214609a1982497d652d46057b5ad725841ed949c52a4f327312e5b0dc1178e8be9cc2f923df7459fa1bae137cff63cbd3b4ed6dce81cb09000a882855d013caf16e84deafcce3f5c1c2886055b7ddaf6e3f4086103963b3845e79658b76afcb138c78567ac82cdaf432e9a6bcbf78f1908d23fd12403e8c997f4c21313437539b068d8bbccb83b9c29b75af4ab234eea19185ca3813a7fb8a2b385835b9f4565affc430a2cb3c80d6c9a67fe9b57e9e62bd8dd99085ae200e382a6c416153b575278df4befbf3f9f80339f2336ec750592fb1c51f0dcf1ed46774501e9357bdef75758497",
              "audio_file_url": "exercises/audio/2.mp3"
            },
            {
              "id": "627a329e-d169-4324-ab1a-ead74291cf0d",
              "name": "Listening Quiz 1",
              "question": "Would you mind holding the door, please?",
              "system_answer": "C",
              "type": {
                "id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
                "name": "Multiple Choice",
                "description": "Choose the correct answer from the given options."
              },
              "type_id": "3aded9b5-2f14-4814-bf39-707d5bffcb76",
              "level": "A1",
              "skill": "listening",
              "image": null,
              "lesson": "b100e00d-4750-48f7-9e43-4f0f6d3b084f",
              "generated_by": "system",
              "description": "Listen to the recorded question and select the best response.",
              "options": [
                {
                  "key": "A",
                  "option": "Thanks a lot"
                },
                {
                  "key": "B",
                  "option": "Sounds good"
                },
                {
                  "key": "C",
                  "option": "Up to you"
                }
              ],
              "audio_file": "https://storage.googleapis.com/None/exercises/audio/1.mp3?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=engventure-backend%40engventure-461203.iam.gserviceaccount.com%2F20250605%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250605T142551Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=09e34834970523adb44910a07180e717ad0d0ad97e464f090a8d2b91b065ffeb4f98ae0229cedba5818d90b55dea06657d00ca6914c168aed8d3b33f0a9d15a282f7e3c1c9caa059e7039e8049d6cbb68795f3ce5030e10d122bf75af6fcd8a68592b5e12b46d5bd79d48498d144b6b06a9637a76980f098a5c2e8fe1708770385bef657933cd1428e0b02f9bdab15e0c58a2a2e8f83a5ccabb1fdf5c1103729a45812bfa36fc877e543d77ff5ffaf1c66ee36eb207fdfb0dca8dfd3661df1f779f2801043ca9918e31d2b4f4bb6e6e0fdd839528608691a8ac2bc47200989da9308f25c12a2bd63083749847d931d0d0a78b2d98c3fba9a64af995ecf7e1e6b",
              "audio_file_url": "exercises/audio/1.mp3"
            }
          ]
        }
      ])
      console.log("check exercises: ", exercises)
    };
    fetchExercises();
  }, []);

  //   const writingExercises = exercises.filter(
  //     (exercise) => exercise.skill === "writing"
  //   );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {exercises.map((exercise) => (
        <Link
          key={exercise.id}
          href={`/${locale}/student/practice/reading/${exercise.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {/* <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 className="font-bold text-2xl">{exercise?.name}</h3>
            <p className="text-base text-black">{exercise?.description}</p>
          </div> */}
          <div className="w-[300px] border-4 border-amber-500 rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-2xl text-gray-800 mb-2">{exercise?.name}</h3>
            <p className="text-base text-gray-600">{exercise?.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReadingExercises;
