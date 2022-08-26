import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

const Home: NextPage = (props: Partial<DropzoneProps>) => {
  const theme = useMantineTheme();
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = async (files: File[]) => {
    setLoading(true);
    console.log("accepted files", files);
    const answers = [];
    for (var i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append("file", files[i]);
      const answer = await fetch("http://127.0.0.1:2898/upload", {
        method: "POST",
        body: data,
      });
      const ans = await answer.text();
      console.log(ans);
      answers.push(ans);
    }
    if (answers.length > 1) {
      setType(answers.join(", "));
    } else {
      setType(answers[0]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TotallyLegit</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>TotallyLegit</h1>
        <Dropzone
          onDrop={onDrop}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          loading={loading}
          {...props}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Перетащите сюда документы или нажмите чтобы выбрать файлы
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Прикрепите любое количество файлов
              </Text>
            </div>
          </Group>
        </Dropzone>
        {type && <h3>Тип: {type}</h3>}
        <div className={styles.footer}>
          <img src="/drivehack.png" width="256px" height="48px" />
          <img src="/mos.png" width="90px" height="90px" />
        </div>
      </main>
    </div>
  );
};

export default Home;
