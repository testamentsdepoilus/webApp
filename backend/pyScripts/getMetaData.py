import os.path
from bs4 import NavigableString
from bs4 import BeautifulSoup
import os
from teiToHtml import transcription, edition


def parse_item(page_, i_, text_, texts_):
    if page_.name is not None:
        if page_.name == "choice":
            for element in page_.contents:
                if element.name == "sic" and element.get_text() != "":
                    text_ += element.get_text(" ", strip=True)
                    text_ = text_.rstrip()
                elif element.name == "abbr" and element.get_text() != "":
                    text_ += element.get_text(" ", strip=True)
                    text_ = text_.rstrip()
        elif page_.name == "add":
            for element in page_.contents:
                [i_, text_, texts_] = parse_item(element, i_, text_, texts_)
        elif page_.name == "hi":
            text_ = text_.rstrip()
            text_ += page_.get_text(" ", strip=True)
        else:
            # if page_.name == "p":
            # 	text_ += ""
            for content in page_.contents:
                if content.name == "pb":
                    texts_.append(text_.strip())
                    text_ = ""
                    i_ += 1
                elif content.name in ["add", "address"]:
                    for element in content.contents:
                        [i_, text_, texts_] = parse_item(
                            element, i_, text_, texts_)
                elif content.name == "choice":
                    for element in content.contents:
                        if element.name == "pb":
                            texts_.append(text_.strip())
                            text_ = ""
                            i_ += 1
                        elif element.name == "sic" and element.get_text() != "":
                            text_ += element.get_text(" ", strip=True)
                            text_ = text_.rstrip()
                        elif element.name == "abbr" and element.get_text() != "":
                            text_ += element.get_text(" ", strip=True)
                            text_ = text_.rstrip()
                elif content.name in ["date", "orgName", "persName", "placeName", "addrLine"]:
                    for element in content.contents:
                        if element.name == "pb":
                            texts_.append(text_.strip())
                            text_ = ""
                            i_ += 1
                        elif element.name == "choice":
                            for element2 in element.contents:
                                if element2.name == "sic" and element2.get_text() != "":
                                    text_ += element2.get_text(" ", strip=True)
                                    text_ = text_.rstrip()
                                elif element2.name == "abbr" and element2.get_text() != "":
                                    text_ += element2.get_text(" ", strip=True)
                                    text_ = text_.rstrip()
                        elif element.name is not None:
                            text_ += element.get_text(" ", strip=True)
                        elif element.string is not None:
                            text_ += element.string
                            text_ = text_.rstrip() + " "
                elif content.name == "app":
                    for element in content.find_all('lem'):
                        # text_ += element.get_text()
                        # text_ = text_.rstrip()
                        [i_, text_, texts_] = parse_item(
                            element, i_, text_, texts_)
                elif content.name == "item":
                    text_ += '\n'
                    for element in content.contents:
                        [i_, text_, texts_] = parse_item(
                            element, i_, text_, texts_)
                elif content.name == "p":
                    [i_, text_, texts_] = parse_item(
                        content, i_, text_, texts_)
                elif content.name == "hi":
                    text_ += content.get_text()
                elif content.name is not None and content.name != 'del':
                    text_ += content.get_text(" ", strip=True)
                elif content.string is not None:
                    # if content.previous_sibling is not None and content.previous_sibling.name != "choice":
                    # 	print(content)
                    # 	text_ += " "
                    text_ += content.string
                    text_ = text_.rstrip() + " "

    else:
        text_ += str(page_)
        text_ = text_.rstrip() + " "
    return [i_, text_, texts_]


def get_text(page_, n_pages):
    i_ = 0
    text_ = ""
    texts = []
    while page_ is not None:
        if page_.name is not None:
            if page_.name == "pb":
                texts.append(text_.strip())
                text_ = ""
                i_ += 1
            elif page_ is not None:
                [i_, text_, texts] = parse_item(page_, i_, text_, texts)
        page_ = page_.next_sibling
    if text_ != "" and len(texts) < n_pages:
        texts.append(text_.strip())
    return texts


def get_meta_data(file_tei, file_pers, file_place, tei_transcription={}, tei_edition={}):
    with open(file_tei, encoding='utf8') as fp:
        soup = BeautifulSoup(fp, "lxml-xml")

    with open(file_pers, encoding='utf8') as fp:
        soup_pers = BeautifulSoup(fp, "lxml-xml")

    with open(file_place, encoding='utf8') as fp:
        soup_place = BeautifulSoup(fp, "lxml-xml")

    # init doc
    doc = dict()

    # Contributions
    file_desc = soup.find("fileDesc")
    edition_stmt = file_desc.editionStmt
    doc['contributions'] = []
    if edition_stmt is not None:
        respStmt_all = edition_stmt.find_all("respStmt")
        for respStmt in respStmt_all:
            contribution = dict()
            if respStmt.find("persName"):
                contribution['resp'] = respStmt.resp.string
                contribution['persName'] = []
                if contribution['resp'] == "Identification et description du testament":
                    for item in respStmt.find_all("persName"):
                        if item.string is not None:
                            contribution['persName'].append(item.string.strip())
                        elif 'ref' in item.attrs:
                            contribution['persName'].append(item['ref'].replace("#", ""))
                else:
                    for item in respStmt.find_all("persName"):
                        if item.string is not None:
                            contribution['persName'].append(item.string.strip())
                        elif 'ref' in item.attrs:
                            contribution['persName'].append(item['ref'].replace("#", ""))

                doc['contributions'].append(contribution)
    # will identifier
    ms_identifier = file_desc.sourceDesc.msDesc.msIdentifier
    doc['will_identifier.institution'] = ms_identifier.institution.string.strip()
    doc['will_identifier.collection'] = ms_identifier.collection.string.strip()
    doc['will_identifier.idno'] = ms_identifier.idno.string.split("(")[
        0].strip()
    doc['will_identifier.cote'] = doc['will_identifier.idno'].split(',')[
        0].strip()
    doc['will_identifier.name'] = ms_identifier.msName.string.strip()

    # will physDesc
    phys_desc = file_desc.sourceDesc.msDesc.physDesc
    if phys_desc.objectDesc.supportDesc.support is not None:
        doc['will_physDesc.support'] = phys_desc.objectDesc.supportDesc.support.string
    if phys_desc.objectDesc.supportDesc.extent is not None:
        doc['will_physDesc.supportDesc'] = phys_desc.objectDesc.supportDesc.extent.dimensions.previous_element
        doc['will_physDesc.dim'] = dict()
        doc['will_physDesc.dim']["unit"] = phys_desc.objectDesc.supportDesc.extent.dimensions['unit']
        doc['will_physDesc.dim']["height"] = phys_desc.objectDesc.supportDesc.extent.dimensions.height.string.strip()
        doc['will_physDesc.dim']["width"] = phys_desc.objectDesc.supportDesc.extent.dimensions.width.string.strip()
    if phys_desc.handDesc is not None:
        doc['will_physDesc.handDesc'] = phys_desc.handDesc.get_text().strip()

    # will contents
    if file_desc.sourceDesc.msDesc.msContents is not None:
        ms_contents = file_desc.sourceDesc.msDesc.msContents.summary
        # testator name
        pers_name = ms_contents.find("persName")
        testator_ref = pers_name['ref'].replace("#", "").strip()

        doc['testator.ref'] = testator_ref.split("-")[1]
        doc['testator.forename'] = ""
        doc['testator.surname'] = ""
        doc['testator.name_norm'] = ""
        for item in pers_name.find_all("surname"):
            doc['testator.surname'] += item.string.strip() + ' '
            doc['testator.name_norm'] += item.string.replace(" ", "")
        doc['testator.surname'] = doc['testator.surname'].strip()
        doc['testator.name_norm'] += " "
        for item in pers_name.find_all("forename"):
            doc['testator.forename'] += item.string + ' '
            doc['testator.name_norm'] += item.string + ' '

        doc['testator.forename'] = doc['testator.forename'].strip()
        doc['testator.name'] = doc['testator.surname'] + \
            "+" + doc['testator.forename']
        doc['testator.name_norm'] = doc['testator.name_norm'].lower()
        doc['testator.name_norm'] = doc['testator.name_norm'].replace("é", "e")
        doc['testator.name_norm'] = doc['testator.name_norm'].replace("ë", "e")
        doc['testator.occupation'] = []
        doc['testator.occupation_norm'] = []

        doc["will_contents.place"] = []
        will_date = ms_contents.find(type="willDate")
        if will_date is not None:
            if 'when' in will_date.attrs:
                doc['will_contents.will_date'] = will_date['when']
                doc['will_contents.will_date_range'] = {
                    "gte": will_date['when'], "lte": will_date['when']}
            elif 'notAfter' in will_date.attrs and 'notBefore' in will_date.attrs:
                doc['will_contents.will_date'] = will_date['notBefore']
                doc['will_contents.will_date_range'] = {
                    "gte": will_date['notBefore'], "lte": will_date['notAfter']}
        will_place = ms_contents.find(type="willPlace")
        if will_place is not None:
            doc['will_contents.will_place_norm'] = will_place.string.split("(")[0].strip()
            if doc['will_contents.will_place_norm'] not in doc["will_contents.place"]:
                doc["will_contents.place"].append(
                    doc['will_contents.will_place_norm'])
            if 'ref' in will_place.attrs:
                doc["will_contents.will_place_ref"] = will_place['ref'].split('#')[
                    1].split('-')[1].strip()
                place_tag = soup_place.find(
                    "place", {'xml:id': will_place['ref'].split('#')[1]})

                if place_tag.geo is not None:
                    geo_point = place_tag.geo.string.split(' ')
                    doc['will_contents.will_place'] = {
                        "lat": geo_point[0], "lon": geo_point[1]}

        pers_tag = soup_pers.find("person", {'xml:id': testator_ref})
        if pers_tag is not None:
            for occupation in pers_tag.find_all("occupation"):
                if occupation.string is not None:
                    doc['testator.occupation'].append(occupation.string.split(" [")[0])
                    doc['testator.occupation_norm'].append(occupation.string.split(" [")[0].lower().replace("é", "e"))
            affiliation = pers_tag.affiliation
            if affiliation is not None:
                org_name = affiliation.find('orgName')
                if org_name is not None:
                    doc['testator.affiliation'] = org_name.get_text().strip()
                    #doc['testator.affiliation'] = doc['testator.affiliation'].lower()
                    #doc['testator.affiliation'] = doc['testator.affiliation'].replace("’", "'")
            birth = pers_tag.birth
            doc['will_contents.birth_text'] = birth.next_element.string
            doc['will_contents.birth_date_range'] = []
            for date in birth.find_all('date'):
                doc['will_contents.birth_text'] += date.string
                if isinstance(date.next_sibling, NavigableString) and date.next_sibling.string != "\n":
                    doc['will_contents.birth_text'] += date.next_sibling
                if 'when' in date.attrs and len(date['when']) > 0:
                    if "[" in date['when']:
                        doc['will_contents.birth_date_range'].append(
                            {"gte": date['when'].split("[")[0].strip(), "lte": date['when'].split("[")[0].strip()})
                    else:
                        doc['will_contents.birth_date_range'].append({"gte": date['when'], "lte": date['when']})
                elif 'notAfter' in date.attrs and 'notBefore' in date.attrs:
                    date_notBefore = date['notBefore']
                    date_notAfter = date['notAfter']
                    if "[" in date_notBefore:
                        date_notBefore = date_notBefore.split("[")[0].strip()
                    if "[" in date_notAfter:
                        date_notAfter = date_notAfter.split("[")[0].strip()
                    doc['will_contents.birth_date_range'].append({"gte": date_notBefore, "lte": date_notAfter})
            if birth.placeName is not None and 'ref' in birth.placeName.attrs:
                # doc['will_contents.birth_place_norm'] = birth.placeName.string.split('(')[0].strip()
                # doc['will_contents.birth_place_norm'] = doc['will_contents.birth_place_norm'].split(",")[0].strip()
                doc['will_contents.birth_place_ref'] = birth.placeName['ref'].split('#')[
                    1].split('-')[1].strip()
                place_tag = soup_place.find(
                    "place", {'xml:id': birth.placeName['ref'].split('#')[1]})
                if place_tag.geo is not None:
                    geo_point = place_tag.geo.string.split(' ')
                    doc['will_contents.birth_place'] = {
                        "lat": geo_point[0], "lon": geo_point[1]}
                    doc['will_contents.birth_place_norm'] = place_tag.settlement.string.string.split("(")[0].strip()
                    if doc['will_contents.birth_place_norm'] not in doc["will_contents.place"]:
                        doc["will_contents.place"].append(
                            doc['will_contents.birth_place_norm'])

            death = pers_tag.death
            # if 'NOT' not in death.date['when'] and 'MDH' not in death.date['when']:
            #     doc['will_contents.death_date'] = death.date['when']
            # else:
            #     doc['will_contents.death_date'] = death.date['when'].split(' ')[0]
            doc['will_contents.death_text'] = death.next_element.string
            doc['will_contents.death_date_range'] = []
            for date in death.find_all('date'):
                doc['will_contents.death_text'] += date.string
                if isinstance(date.next_sibling, NavigableString) and date.next_sibling.string != "\n":
                    doc['will_contents.death_text'] += date.next_sibling.string
                if 'when' in date.attrs and len(date['when']) > 0:
                    if "[" in date['when']:
                        doc['will_contents.death_date_range'].append(
                            {"gte": date['when'].split("[")[0].strip(), "lte": date['when'].split("[")[0].strip()})
                    else:
                        doc['will_contents.death_date_range'].append({"gte": date['when'], "lte": date['when']})
                elif 'notAfter' in date.attrs and 'notBefore' in date.attrs:
                    date_notBefore = date['notBefore']
                    date_notAfter = date['notAfter']
                    if "[" in date_notBefore:
                        date_notBefore = date_notBefore.split("[")[0].strip()
                    if "[" in date_notAfter:
                        date_notAfter = date_notAfter.split("[")[0].strip()
                    doc['will_contents.death_date_range'].append({"gte": date_notBefore, "lte": date_notAfter})

            if death.placeName is not None:
                if 'ref' in death.placeName.attrs:
                    doc['will_contents.death_place_ref'] = death.placeName['ref'].split('#')[1].split('-')[1].strip()
                    place_tag = soup_place.find(
                        "place", {'xml:id': death.placeName['ref'].split('#')[1]})

                    if place_tag.geo is not None:
                        geo_point = place_tag.geo.string.split(' ')
                        doc['will_contents.death_place'] = {
                            "lat": geo_point[0], "lon": geo_point[1]}
                    if place_tag.settlement.string is not None:
                        doc['will_contents.death_place_norm'] = place_tag.settlement.string.string.split("(")[0].strip()
                        if doc['will_contents.death_place_norm'] not in doc["will_contents.place"]:
                            doc["will_contents.place"].append(
                                doc['will_contents.death_place_norm'])
                    elif place_tag.geogName.string is not None:
                        doc['will_contents.death_place_norm'] = place_tag.geogName.string.split("(")[0].strip()
                        if doc['will_contents.death_place_norm'] not in doc["will_contents.place"]:
                            doc["will_contents.place"].append(
                                doc['will_contents.death_place_norm'])
                if death.placeName.string is not None:
                    doc['will_contents.death_place_text'] = death.placeName.string
                    if isinstance(death.placeName.next_sibling, NavigableString) and death.placeName.next_sibling.string != "\n":
                        doc['will_contents.death_place_text'] += death.placeName.next_sibling.string

            residence = pers_tag.residence
            if residence is not None:
                if 'ref' in residence.attrs:
                    doc['will_contents.residence_ref'] = residence['ref'].split('#')[
                        1].split('-')[1].strip()
                    place_tag = soup_place.find(
                        "place", {'xml:id': residence['ref'].split('#')[1]})
                    if place_tag.geo is not None:
                        geo_point = place_tag.geo.string.split(' ')
                        doc['will_contents.residence_geo'] = {
                            "lat": geo_point[0], "lon": geo_point[1]}
                        doc['will_contents.residence_norm'] = place_tag.settlement.string.string.split("(")[0].strip()
                        if doc['will_contents.residence_norm'] not in doc["will_contents.place"]:
                            doc["will_contents.place"].append(
                                doc['will_contents.residence_norm'])




        # death_place = ms_contents.find(type="willAuthorDeathPlace")
        # if death_place is not None:
        # 	doc['will_contents.death_place_norm'] = death_place.string.strip()

    # will provenance
    will_provenance = file_desc.sourceDesc.msDesc.history.provenance.orgName
    doc['will_provenance'] = will_provenance.string

    # picture (page scan) id & url
    facsimile = soup.find("facsimile")
    url_base = facsimile['xml:base']
    graphics = {"will": [], "envelope": [], "codicil": []}
    id_pages = {"will": [], "envelope": [], "codicil": []}
    for item in facsimile.find_all("surface"):
        if item['type'] == "will-page":
            graphics["will"].append(os.path.join(
                url_base.strip(), item.graphic['url'].strip()))
            id_pages["will"].append(item.graphic['xml:id'].strip())
        elif "envelope" in item['type']:
            graphics["envelope"].append(os.path.join(
                url_base.strip(), item.graphic['url'].strip()))
            id_pages["envelope"].append(item.graphic['xml:id'].strip())
        elif "codicil" in item['type']:
            graphics["codicil"].append(os.path.join(
                url_base.strip(), item.graphic['url'].strip()))
            id_pages["codicil"].append(item.graphic['xml:id'].strip())

    # will id
    text = soup.find("text")
    doc['will_id'] = text['xml:id'].strip()
    doc['will_id'] = doc['will_id'].replace("will_", "")

    # will text
    texts = {"will": [], "envelope": [], "codicil": []}
    div_will = text.find("div", type="will")
    if div_will:
        pages = div_will.find_all("pb")
        page = pages[0]
        page = page.next_sibling
        texts["will"] = get_text(page, len(id_pages["will"]))
    div_envelope = text.find("div", type="envelope")

    if div_envelope:
        pages = div_envelope.find_all("pb")
        page = pages[0]
        page = page.next_sibling
        texts["envelope"] = get_text(page, len(id_pages["envelope"]))

    div_codicil = text.find("div", type="codicil")
    if div_codicil:
        pages = div_codicil.find_all("pb")
        page = pages[0]
        page = page.next_sibling
        texts["codicil"] = get_text(page, len(id_pages["codicil"]))

    doc['will_pages'] = []

    for key in id_pages.keys():
        for i in range(len(id_pages[key])):
            page_dict = dict()
            page_dict['page_type'] = {
                "type": key.replace("will", "page"), "id": i+1}
            page_dict['page_id'] = id_pages[key][i]

            # for char in [" .", "' ", " ,"]:
            # 	texts[key][i] = texts[key][i].strip().replace(char, char.strip())

            # page_dict['transcription_text'] = re.sub(' +', ' ', texts[key][i] )
            # page_dict['transcription_text'] = re.sub(r'\n\s*\n', '\n', page_dict['transcription_text'])

            page_dict['picture_url'] = graphics[key][i]
            page_dict['transcription'] = tei_transcription[key][i]
            # page_dict['transcription_text'] = page_dict['transcription']
            # page_dict['edition'] = tei_edition[key][i].replace("> <", "><")
            page_dict['edition'] = tei_edition[key][i]
            # page_dict['edition_text'] = page_dict['edition']
            # edit_soup = BeautifulSoup(tei_edition[key][i], 'html.parser')
            # page_dict['edition_text'] = re.sub(' +', ' ', edit_soup.get_text())
            # for char in [" .", "' ", " ,", " - "]:
            # 	page_dict['edition_text'] = page_dict['edition_text'].strip().replace(char, char.strip())
            # page_dict['edition_text'] =  page_dict['edition_text'].replace('  ', ' ')
            doc['will_pages'].append(page_dict)

    return doc


if __name__ == "__main__":
    # for file_ in os.listdir('../../../../data/toto/'):
    # will_342_AN_0273_2020-04-08_10-44-17_V2.xml
    fileTei = os.path.join('../client/build/files/wills/',
                           "will_AD78_0037.xml")
    # fileTei = '/home/adoula/Downloads/will_AN_0001.xml'
    persFile = '../client/build/files/notices/personnes.xml'
    placeFile = '../client/build/files/notices/lieux.xml'
    configFile = 'config.json'
    transcription_ = transcription(fileTei, configFile)
    edition_ = edition(fileTei, configFile)
    doc = get_meta_data(fileTei, persFile, placeFile, transcription_, edition_)
    print(doc["will_contents.place"])
    print("**************************************")
    # print(doc['will_pages'][0]['edition'])
    print("**************************************")
    # print(doc)
