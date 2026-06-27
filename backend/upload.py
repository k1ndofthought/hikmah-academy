import os
import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        print("Starting Database Seeding...")

        # 1. Define the curated list of Ustazs (Scholars) with their profile info
        scholars_data = [
            {
                "name": "Ustaz Wahid (Al-Hikmah / Wahidcom Apologetics Channel)",
                "title": "Ethio-Semitic Comparative Theologian & Apologist",
                "bio": "A prominent contemporary Ethio-Semitic comparative theologian, apologist, and educator. He is the founder of the Al-Hikmah Academy and host of the highly popular Wahidcom channel, known for in-depth comparative scripture research in Amharic, Ge'ez, Arabic, and Hebrew.",
                "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
                "contributions": "Founded Al-Hikmah Academy, producing hundreds of scholarly analyses clarifying Ge'ez, Arabic, and Hebrew scripture translations for East African seekers.",
                "youtube": "https://www.youtube.com/@wahidcom",
                "telegram": "https://t.me/Wahidcomparative",
                "website": "",
                "facebook": ""
            },
            {
                "name": "Dr. Ismail Al-Faruqi",
                "title": "Professor of Religion & Comparative Theology",
                "bio": "A world-renowned Palestinian-American philosopher and authority on Islamic theology and comparative religion. He founded and chaired the Islamic Studies program at Temple University and dedicated his life to creating rigorous frameworks for interfaith dialogue.",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
                "contributions": "Pioneered intellectual frameworks for the Islamization of Knowledge, establishing foundational blueprints for contemporary comparative religious studies.",
                "youtube": "https://www.youtube.com/results?search_query=Dr+Ismail+Al-Faruqi+lectures",
                "telegram": "https://t.me/AlFaruqiLibrary",
                "website": "https://iiit.org",
                "facebook": ""
            },
            {
                "name": "Dr. Tarik Ramadan",
                "title": "Professor of Contemporary Islamic Studies",
                "bio": "Swiss academic, philosopher, and writer. He is a professor of Contemporary Islamic Studies at Oxford University, specializing in Islamic theology, ethics, and contemporary reform.",
                "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
                "contributions": "Authored over 30 academic books bridging classical theology with modern Western sociology, fostering ethical engagement.",
                "youtube": "https://www.youtube.com/results?search_query=Tarik+Ramadan+lectures",
                "telegram": "https://t.me/TarikRamadanOfficial",
                "website": "https://www.tarikramadan.com",
                "facebook": ""
            },
            {
                "name": "Prof. Maria Rosa Menocal",
                "title": "Sterling Professor of Humanities, Yale University",
                "bio": "Acclaimed medievalist and Sterling Professor of Humanities at Yale University. She specialized in medieval Iberian literature, famously authoring 'The Ornament of the World'.",
                "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
                "contributions": "Documented and highlighted the unique pluralism and scientific synthesis of Al-Andalus, showing the historical co-existence of Muslims, Jews, and Christians.",
                "youtube": "",
                "telegram": "",
                "website": "https://www.yale.edu/medieval-studies",
                "facebook": ""
            },
            {
                "name": "Shaykh Yusuf Qaradawi",
                "title": "Prominent Theologian & Jurisprudent",
                "bio": "A prominent Egyptian Islamic scholar, jurist, and theologian. He authored over 120 books on Islamic jurisprudence, comparative religion, and contemporary social rulings.",
                "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
                "contributions": "Maintained a balanced legal approach focusing on facilitating ease and addressing contemporary concerns through classical legal principles.",
                "youtube": "https://www.youtube.com/results?search_query=Shaykh+Yusuf+Qaradawi",
                "telegram": "https://t.me/QaradawiLibrary",
                "website": "",
                "facebook": ""
            },
            {
                "name": "Dr. Seyyed Hossein Nasr",
                "title": "Professor of Islamic Studies, George Washington University",
                "bio": "Distinguished Iranian philosopher and Professor of Islamic Studies at George Washington University. A major voice in traditionalist philosophy, metaphysics, and history of science.",
                "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
                "contributions": "Explained the metaphysical unity underlying science and nature in traditional civilization, proposing solutions to the modern ecological crisis.",
                "youtube": "https://www.youtube.com/results?search_query=Dr+Seyyed+Hossein+Nasr",
                "telegram": "",
                "website": "https://www.seyyedhosseinnasr.com",
                "facebook": ""
            },
            {
                "name": "Dr. Jonathan Brown",
                "title": "Alwaleed Chair of Islamic Civilization, Georgetown University",
                "bio": "American scholar of Islamic studies and professor at Georgetown University's School of Foreign Service. Author of 'Hadith: Muhammad's Legacy'.",
                "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
                "contributions": "Demystified the rigorous historical methodology of Islamic Hadith classification and biography evaluation systems ('Ilm al-Rijal) for the global English-speaking community.",
                "youtube": "https://www.youtube.com/results?search_query=Dr+Jonathan+Brown+hadith",
                "telegram": "https://t.me/JonathanBrownLectures",
                "website": "https://www.drjonathanbrown.com",
                "facebook": ""
            },
            {
                "name": "Prof. George Saliba",
                "title": "Professor of Arabic and Islamic Science, Columbia University",
                "bio": "Lebanese-American professor of Arabic and Islamic Science at Columbia University. Leading authority on astronomical developments and scientific transmissions.",
                "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop",
                "contributions": "Revealed the deep astronomical dependencies of the European Renaissance (including Copernicus's models) on medieval Islamic texts.",
                "youtube": "https://www.youtube.com/results?search_query=George+Saliba+Islamic+science",
                "telegram": "",
                "website": "https://www.columbia.edu/~gas1/",
                "facebook": ""
            }
        ]

        # 2. Define Curated Books with their PDF links
        books_data = [
            {
                "title": "The Angel of YHWH: Comprehensive Biblical and Quranic Critique",
                "description": "An extended academic text analyzing the 'Malakh YHWH' motif in Hebrew scriptures, proving proxy agency rather than deity, written for comparative study circles.",
                "pdf_url": "https://wahidcom.org/books/angel-yhwh.pdf",
                "pages_count": 124,
                "content": "PAGE 1: EXEGESIS OF THE ANGEL OF YHWH...\nPAGE 2: GE'EZ COMPARATIVE TERM ANALYSIS...",
                "ustaz_name": "Ustaz Wahid (Al-Hikmah / Wahidcom Apologetics Channel)"
            },
            {
                "title": "Al-Tawhid: Its Implications for Thought and Life",
                "description": "The foundational text analyzing monotheism across ethical, sociological, and aesthetic dimensions, exploring how the unity of God demands a unified ethical worldview.",
                "pdf_url": "https://iiit.org/books/altawhid.pdf",
                "pages_count": 240,
                "content": "PAGE 1: AL-TAWHID OVERVIEW...\nPAGE 2: EPISTEMOLOGICAL IMPLICATIONS...",
                "ustaz_name": "Dr. Ismail Al-Faruqi"
            },
            {
                "title": "In the Footsteps of the Prophet",
                "description": "Lessons from the life of Muhammad (PBUH) highlighting moral clarity, spiritual depth, and active engagement with society.",
                "pdf_url": "https://tarikramadan.com/books/footsteps.pdf",
                "pages_count": 368,
                "content": "PAGE 1: THE CRADLE OF REVELATION...\nPAGE 2: THE COVENANT OF MEDINA...",
                "ustaz_name": "Dr. Tarik Ramadan"
            },
            {
                "title": "The Ornament of the World",
                "description": "An inquiry into the historical socio-political conditions of Al-Andalus, tracing how Muslims, Jews, and Christians created a highly collaborative and advanced intellectual culture.",
                "pdf_url": "https://yale.edu/books/menocal-ornament.pdf",
                "pages_count": 315,
                "content": "PAGE 1: THE GATES OF CORDOVA...\nPAGE 2: TRANSLATION AND REBIRTH...",
                "ustaz_name": "Prof. Maria Rosa Menocal"
            },
            {
                "title": "The Lawful and the Prohibited in Islam",
                "description": "A comprehensive guide analyzing daily ethics, dietary rules, finance, and social relationships under Islamic law, highlighting mercy and benefit.",
                "pdf_url": "https://qaradawi.org/books/lawful-prohibited.pdf",
                "pages_count": 280,
                "content": "PAGE 1: CONSTITUTION OF MORALITY...\nPAGE 2: DIETARY AND WORKPLACE STANDARDS...",
                "ustaz_name": "Shaykh Yusuf Qaradawi"
            },
            {
                "title": "Science and Civilization in Islam",
                "description": "Exploring the metaphysical framework that allowed empirical sciences to thrive in Islamic civilizations, showing how research was integrated into a unified spiritual vision.",
                "pdf_url": "https://seyyedhosseinnasr.com/books/science-civilization.pdf",
                "pages_count": 384,
                "content": "PAGE 1: METAPHYSICAL FOUNDATIONS OF SCIENCE...\nPAGE 2: INSTITUTIONS OF LEARNING...",
                "ustaz_name": "Dr. Seyyed Hossein Nasr"
            },
            {
                "title": "Hadith: Muhammad's Legacy",
                "description": "The complete history of how oral reports were cataloged, authenticated, and debated across history, showcasing the meticulous 'Ilm al-Rijal (Science of Biography) evaluation system.",
                "pdf_url": "https://drjonathanbrown.com/books/hadith-legacy.pdf",
                "pages_count": 340,
                "content": "PAGE 1: TRANSMISSION AND REVOLUTION...\nPAGE 2: EVALUATION AND AUTHENTICATION...",
                "ustaz_name": "Dr. Jonathan Brown"
            },
            {
                "title": "Islamic Science and the Making of the European Renaissance",
                "description": "A revolutionary study revealing the deep scientific, mathematical, and astronomical dependencies of Copernicus and early European scientists on classical Arabic texts.",
                "pdf_url": "https://columbia.edu/books/saliba-renaissance.pdf",
                "pages_count": 298,
                "content": "PAGE 1: MARAGHA OBSERVATORY...\nPAGE 2: MEDICAL MANUSCRIPT IMPORTS...",
                "ustaz_name": "Prof. George Saliba"
            }
        ]

        # Seed Ustazs and capture mapping
        ustaz_name_to_id = {}
        for ustaz_data in scholars_data:
            # Check if name already exists
            db_ustaz = db.query(models.Ustaz).filter(models.Ustaz.name == ustaz_data["name"]).first()
            if not db_ustaz:
                db_ustaz = models.Ustaz(**ustaz_data)
                db.add(db_ustaz)
                db.commit()
                db.refresh(db_ustaz)
                print(f"Added Ustaz: {db_ustaz.name}")
            else:
                print(f"Ustaz '{db_ustaz.name}' already exists. Updating...")
                for key, val in ustaz_data.items():
                    setattr(db_ustaz, key, val)
                db.commit()
            ustaz_name_to_id[db_ustaz.name] = db_ustaz.id

        # Seed Books
        for book_data in books_data:
            ustaz_id = ustaz_name_to_id.get(book_data["ustaz_name"])
            if ustaz_id:
                # Check if book already exists
                db_book = db.query(models.Book).filter(
                    models.Book.title == book_data["title"],
                    models.Book.ustaz_id == ustaz_id
                ).first()
                if not db_book:
                    db_book = models.Book(
                        title=book_data["title"],
                        description=book_data["description"],
                        pdf_url=book_data["pdf_url"],
                        pages_count=book_data["pages_count"],
                        content=book_data["content"],
                        ustaz_id=ustaz_id
                    )
                    db.add(db_book)
                    db.commit()
                    print(f"Added PDF Book: {db_book.title}")
            else:
                print(f"Could not find Ustaz '{book_data['ustaz_name']}' for book '{book_data['title']}'")

        # 3. Seed Articles from articles.json
        articles_json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "articles.json")
        if os.path.exists(articles_json_path):
            with open(articles_json_path, "r", encoding="utf-8") as file:
                articles_list = json.load(file)
            
            print(f"Found articles.json with {len(articles_list)} articles. Seeding...")
            for art_data in articles_list:
                # Check if already exists
                db_art = db.query(models.Article).filter(models.Article.id == art_data["id"]).first()
                if db_art:
                    # Clean parts and re-insert
                    db.query(models.ArticlePart).filter(models.ArticlePart.article_id == art_data["id"]).delete()
                    db.delete(db_art)
                    db.commit()

                # Determine associated ustaz ID if any
                author_name = art_data.get("author", "")
                ustaz_id = ustaz_name_to_id.get(author_name)

                # Form the main Article record
                new_art = models.Article(
                    id=art_data["id"],
                    title=art_data["title"],
                    description=art_data.get("description", ""),
                    content=art_data.get("content", ""),
                    category=art_data.get("category", "General"),
                    author=author_name,
                    read_time=art_data.get("readTime", "5 min"),
                    date=art_data.get("date", "June 2026"),
                    image=art_data.get("image", ""),
                    featured=art_data.get("featured", False),
                    scholar_quote=art_data.get("scholarQuote", ""),
                    tags=art_data.get("tags", []),
                    ustaz_id=ustaz_id
                )
                db.add(new_art)
                db.commit()

                # Add multi-parts/chapters if present
                if "parts" in art_data and isinstance(art_data["parts"], list):
                    for idx, part_data in enumerate(art_data["parts"]):
                        new_part = models.ArticlePart(
                            part_number=part_data.get("partNumber", idx + 1),
                            title=part_data.get("title", ""),
                            content=part_data.get("content", ""),
                            read_time=part_data.get("readTime", "5 min"),
                            article_id=art_data["id"]
                        )
                        db.add(new_part)
                    db.commit()
                print(f"Seeded Article: '{new_art.title}' with {len(art_data.get('parts', []))} parts.")

        print("--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---")

    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
